import json

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.course import Course
from backend.app.models.profile import LearnerProfile
from backend.app.models.progress import Enrollment, Progress
from backend.app.models.user import User
from backend.app.recommender.hybrid import recommend
from backend.app.schemas.ai import (
    DetailedRecommendationRead,
    RecommendationGenerateRequest,
    XAIScoreBreakdown,
)
from backend.app.schemas.recommendation import RecommendationRead
from backend.app.ai.skill_extractor import assess_skill_gaps, extract_skills
from backend.app.services.recommendation_service import recommendations_for_user
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[RecommendationRead])
def get_recommendations(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return recommendations_for_user(db, user.id)


@router.post("/generate", response_model=list[DetailedRecommendationRead])
def generate_recommendations(
    payload: RecommendationGenerateRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    target_role = payload.target_role or (profile.target_role if profile else "Full Stack Developer")

    current_skills: list[str] = list(payload.current_skills or [])
    if profile and profile.interests:
        for s in extract_skills(profile.interests):
            if s not in current_skills:
                current_skills.append(s)

    gap_analysis = assess_skill_gaps(current_skills=current_skills, target_role=target_role)
    missing_skills = [g["skill"] for g in gap_analysis.get("skill_gaps", [])]

    completed_ids = {
        p.course_id
        for p in db.query(Progress).join(Enrollment).filter(
            Enrollment.user_id == user.id,
            Progress.completion_percentage >= 100.0,
        ).all()
    }

    courses_db = db.query(Course).all()
    course_items = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "difficulty": c.difficulty,
            "provider": c.provider,
            "url": c.url,
        }
        for c in courses_db
    ]

    goal = payload.goal or target_role
    results = recommend(
        goal=goal,
        items=course_items,
        user_id=user.id,
        current_skills=current_skills,
        missing_skills=missing_skills,
        completed_course_ids=completed_ids,
        db=db,
        top_k=payload.top_k,
    )

    return results
