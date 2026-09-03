from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.ai.adaptive_engine import recalibrate_learning_path
from backend.app.ai.goal_analyzer import analyze_goal
from backend.app.ai.simulator import simulate_scenario
from backend.app.ai.skill_extractor import assess_skill_gaps, extract_skills
from backend.app.database.connection import get_db
from backend.app.models.course import Course
from backend.app.models.profile import LearnerProfile
from backend.app.models.progress import Progress
from backend.app.models.user import User
from backend.app.schemas.ai import (
    AdaptiveRecalibrateRequest,
    AdaptiveRecalibrateResponse,
    GoalAnalysisRequest,
    GoalAnalysisResponse,
    SkillGapRequest,
    SkillGapResponse,
    WhatIfSimulationRequest,
    WhatIfSimulationResponse,
)
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/goal-analysis", response_model=GoalAnalysisResponse)
def run_goal_analysis(
    payload: GoalAnalysisRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Analyze a career or learning goal to identify target roles, core competencies, and learning direction."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    context = {
        "target_role": profile.target_role if profile else None,
        "bio": profile.bio if profile else None,
    }
    result = analyze_goal(payload.goal, profile_context=context)
    return result


@router.post("/skill-gaps", response_model=SkillGapResponse)
def run_skill_gap_analysis(
    payload: SkillGapRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Detect missing skills and prioritize gaps based on prerequisite knowledge graph dependencies."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()

    # Determine target role
    target_role = payload.target_role or (profile.target_role if profile else "Full Stack Developer")

    # Combine explicit skills with skills extracted from profile bio
    current_skills = list(payload.current_skills)
    if profile and profile.bio:
        bio_skills = extract_skills(profile.bio)
        for s in bio_skills:
            if s not in current_skills:
                current_skills.append(s)

    result = assess_skill_gaps(
        current_skills=current_skills,
        target_role=target_role,
        target_skills=payload.target_skills,
    )
    return result


@router.post("/adaptive/recalibrate", response_model=AdaptiveRecalibrateResponse)
def run_adaptive_recalibration(
    payload: AdaptiveRecalibrateRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Dynamically recalibrate recommendations and roadmap pacing based on assessment outcomes."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    target_role = payload.target_role or (profile.target_role if profile else "Full Stack Developer")

    # Fetch completed courses
    completed = {
        p.course_id for p in db.query(Progress).filter_by(user_id=user.id, percent_complete=100.0).all()
    }

    # Fetch courses
    courses_db = db.query(Course).all()
    available_courses = [
        {"id": c.id, "title": c.title, "description": c.description, "provider": c.provider, "url": c.url}
        for c in courses_db
    ]

    current_skills = extract_skills(profile.bio) if (profile and profile.bio) else []

    result = recalibrate_learning_path(
        user_id=user.id,
        target_role=target_role,
        assessment_score=payload.assessment_score,
        topic=payload.topic,
        current_skills=current_skills,
        completed_course_ids=completed,
        available_courses=available_courses,
    )
    return result


@router.post("/simulation/what-if", response_model=WhatIfSimulationResponse)
def run_what_if_simulation(
    payload: WhatIfSimulationRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Execute hypothetical what-if career shift and study pace simulation without modifying user data."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()

    curr_role = payload.current_role or (profile.target_role if profile else "Data Scientist")
    sim_role = payload.simulated_role or "AI Engineer"

    # Fetch courses for course delta
    courses_db = db.query(Course).all()
    available_courses = [
        {"id": c.id, "title": c.title, "description": c.description}
        for c in courses_db
    ]

    current_skills = list(payload.current_skills)
    if profile and profile.bio:
        for s in extract_skills(profile.bio):
            if s not in current_skills:
                current_skills.append(s)

    result = simulate_scenario(
        current_role=curr_role,
        simulated_role=sim_role,
        current_skills=current_skills,
        current_weekly_hours=payload.current_weekly_hours,
        simulated_weekly_hours=payload.simulated_weekly_hours,
        available_courses=available_courses,
    )
    return result
