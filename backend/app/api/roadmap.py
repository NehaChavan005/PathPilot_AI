import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.ai.roadmap_generator import generate_personalized_roadmap
from backend.app.database.connection import get_db
from backend.app.models.certificate import Certificate
from backend.app.models.course import Course
from backend.app.models.phase_progress import PhaseProgress
from backend.app.models.profile import LearnerProfile
from backend.app.models.roadmap import LearningPath
from backend.app.models.user import User
from backend.app.schemas.ai import DetailedRoadmapResponse, RoadmapGenerateRequest
from backend.app.schemas.roadmap import RoadmapCreate, RoadmapRead
from backend.app.ai.skill_extractor import extract_skills
from backend.app.services.roadmap_service import create_roadmap
from backend.app.utils.dependencies import current_user


router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


def serialize(item: LearningPath) -> dict:
    return {
        "id": item.id,
        "user_id": item.user_id,
        "title": item.title,
        "steps": json.loads(item.description or "[]") if item.description else [],
    }


@router.get("", response_model=list[RoadmapRead])
def get_roadmaps(user: User = Depends(current_user), db: Session = Depends(get_db)):
    roadmaps = db.query(LearningPath).filter_by(user_id=user.id).all()
    return [serialize(item) for item in roadmaps]


@router.post("", response_model=RoadmapRead, status_code=status.HTTP_201_CREATED)
def add_roadmap(payload: RoadmapCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    roadmap = create_roadmap(db, user.id, payload.title, payload.steps)
    return serialize(roadmap)


@router.post("/generate", response_model=DetailedRoadmapResponse)
def generate(payload: RoadmapGenerateRequest, user: User = Depends(current_user), db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    target_role = payload.target_role or (profile.target_role if profile else "Full Stack Developer")

    current_skills: list[str] = list(payload.current_skills or [])
    if profile and profile.interests:
        for s in extract_skills(profile.interests):
            if s not in current_skills:
                current_skills.append(s)

    courses_db = db.query(Course).all()
    available_courses = []
    for c in courses_db:
        skills = [cs.skill.name for cs in c.skills] if hasattr(c, "skills") else []
        available_courses.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "provider": c.provider,
            "url": c.url,
            "difficulty": c.difficulty,
            "skills": skills,
        })

    result = generate_personalized_roadmap(
        target_role=target_role,
        current_skills=current_skills,
        available_courses=available_courses,
        weekly_study_hours=payload.weekly_study_hours,
    )

    roadmap = create_roadmap(
        db,
        user.id,
        result["title"],
        result.get("steps", []),
    )

    # Clear any existing phase progress for this roadmap
    db.query(PhaseProgress).filter_by(
        user_id=user.id, roadmap_id=roadmap.id
    ).delete()

    # Persist milestones as phase progress
    for milestone in result.get("milestones", []):
        pp = PhaseProgress(
            user_id=user.id,
            roadmap_id=roadmap.id,
            phase_number=milestone["milestone_number"],
            status=milestone.get("status", "locked"),
            progress_percentage=0.0,
            started_at=datetime.now(timezone.utc) if milestone.get("status") == "in_progress" else None,
        )
        db.add(pp)

    db.commit()

    result["id"] = roadmap.id
    return result


@router.get("/me")
def get_my_roadmap(user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Return the user's latest roadmap with persisted phase statuses."""
    roadmap = (
        db.query(LearningPath)
        .filter_by(user_id=user.id)
        .order_by(LearningPath.created_at.desc())
        .first()
    )
    if not roadmap:
        return {"roadmap": None, "phases": []}

    # Get persisted phase statuses
    phases = (
        db.query(PhaseProgress)
        .filter_by(user_id=user.id, roadmap_id=roadmap.id)
        .order_by(PhaseProgress.phase_number)
        .all()
    )

    phase_map = {}
    for p in phases:
        phase_map[p.phase_number] = {
            "phase_number": p.phase_number,
            "status": p.status,
            "progress_percentage": p.progress_percentage,
            "completed_at": p.completed_at.isoformat() if p.completed_at else None,
        }

    return {
        "roadmap": serialize(roadmap),
        "phases": phase_map,
    }


@router.post("/{roadmap_id}/phases/{phase_number}/advance")
def advance_phase(
    roadmap_id: int,
    phase_number: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Mark a phase as complete and unlock the next one.

    Validates that the previous phase (if any) is already completed.
    Only unlocks the next phase if it is within the roadmap's milestone count.
    """
    # Verify the roadmap belongs to this user
    roadmap = db.query(LearningPath).filter_by(id=roadmap_id, user_id=user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    # Determine total milestone count from the roadmap's saved description
    try:
        steps = json.loads(roadmap.description) if roadmap.description else []
        total_milestones = len(steps) if isinstance(steps, list) else 3
    except Exception:
        total_milestones = 3

    # Check prerequisite: previous phase must be completed
    if phase_number > 1:
        prev = (
            db.query(PhaseProgress)
            .filter_by(user_id=user.id, roadmap_id=roadmap_id, phase_number=phase_number - 1)
            .first()
        )
        if not prev or prev.status != "completed":
            raise HTTPException(
                status_code=400,
                detail=f"Phase {phase_number - 1} must be completed before advancing to phase {phase_number}"
            )

    # Get or create current phase progress
    pp = (
        db.query(PhaseProgress)
        .filter_by(user_id=user.id, roadmap_id=roadmap_id, phase_number=phase_number)
        .first()
    )

    if pp and pp.status == "completed":
        return {"message": "Phase already completed", "phase_number": phase_number, "status": "completed"}

    if not pp:
        pp = PhaseProgress(
            user_id=user.id,
            roadmap_id=roadmap_id,
            phase_number=phase_number,
        )
        db.add(pp)

    pp.status = "completed"
    pp.progress_percentage = 100.0
    pp.completed_at = datetime.now(timezone.utc)
    pp.updated_at = datetime.now(timezone.utc)

    # Unlock next phase (only if within roadmap's milestone count)
    next_phase_number = phase_number + 1
    if next_phase_number <= total_milestones:
        next_pp = (
            db.query(PhaseProgress)
            .filter_by(user_id=user.id, roadmap_id=roadmap_id, phase_number=next_phase_number)
            .first()
        )
        if not next_pp:
            next_pp = PhaseProgress(
                user_id=user.id,
                roadmap_id=roadmap_id,
                phase_number=next_phase_number,
                status="in_progress",
                progress_percentage=0.0,
                started_at=datetime.now(timezone.utc),
            )
            db.add(next_pp)
        elif next_pp.status == "locked":
            next_pp.status = "in_progress"
            next_pp.started_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "message": f"Phase {phase_number} completed! Phase {phase_number + 1} is now unlocked.",
        "phase_number": phase_number,
        "status": "completed",
        "next_unlocked": phase_number + 1,
    }


# ──────────────────── Certificates ────────────────────


@router.get("/certificates")
def list_certificates(user: User = Depends(current_user), db: Session = Depends(get_db)):
    """List all certificates for the current user."""
    certs = (
        db.query(Certificate)
        .filter_by(user_id=user.id)
        .order_by(Certificate.issued_at.desc())
        .all()
    )
    return {
        "certificates": [
            {
                "id": c.id,
                "title": c.title,
                "career": c.career,
                "certificate_code": c.certificate_code,
                "issued_at": c.issued_at.isoformat() if c.issued_at else None,
            }
            for c in certs
        ]
    }


@router.post("/certificates/generate")
def generate_certificate(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Generate a completion certificate if all phases are completed."""
    # Find the user's latest roadmap
    roadmap = (
        db.query(LearningPath)
        .filter_by(user_id=user.id)
        .order_by(LearningPath.created_at.desc())
        .first()
    )
    if not roadmap:
        raise HTTPException(status_code=404, detail="No learning roadmap found. Generate a roadmap first.")

    # Check all phases are completed
    phases = (
        db.query(PhaseProgress)
        .filter_by(user_id=user.id, roadmap_id=roadmap.id)
        .all()
    )

    if not phases:
        raise HTTPException(status_code=400, detail="No phases found for this roadmap. Generate a roadmap first.")

    # Use the roadmap's milestone count, not total PhaseProgress rows
    # (advancing may create extra rows beyond the milestone count)
    try:
        steps = json.loads(roadmap.description) if roadmap.description else []
        total_milestones = len(steps) if isinstance(steps, list) else len(phases)
    except Exception:
        total_milestones = len(phases)

    # Only check phases 1..total_milestones
    relevant_phases = [p for p in phases if p.phase_number <= total_milestones]
    completed_phases = sum(1 for p in relevant_phases if p.status == "completed")

    if completed_phases < total_milestones:
        raise HTTPException(
            status_code=400,
            detail=f"Complete all {total_milestones} phases to earn your certificate. ({completed_phases}/{total_milestones} completed)"
        )

    # Check if certificate already exists
    existing = (
        db.query(Certificate)
        .filter_by(user_id=user.id, roadmap_id=roadmap.id)
        .first()
    )
    if existing:
        return {
            "id": existing.id,
            "title": existing.title,
            "career": existing.career,
            "certificate_code": existing.certificate_code,
            "issued_at": existing.issued_at.isoformat() if existing.issued_at else None,
            "message": "Certificate already issued.",
        }

    # Determine career from roadmap title
    career = roadmap.title.replace("Personalized ", "").replace(" Roadmap", "").strip()
    if not career:
        career = "Software Engineer"

    cert_code = f"PP-{uuid.uuid4().hex[:8].upper()}"

    cert = Certificate(
        user_id=user.id,
        roadmap_id=roadmap.id,
        title=roadmap.title,
        career=career,
        certificate_code=cert_code,
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)

    return {
        "id": cert.id,
        "title": cert.title,
        "career": cert.career,
        "certificate_code": cert.certificate_code,
        "issued_at": cert.issued_at.isoformat() if cert.issued_at else None,
        "message": "Congratulations! Your certificate has been generated.",
    }
