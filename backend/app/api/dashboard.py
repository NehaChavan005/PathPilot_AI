from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.assessment import Assessment
from app.models.progress import Progress
from app.models.user import User
from app.utils.dependencies import current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    progress = db.query(Progress).filter_by(user_id=user.id).all()
    assessments = db.query(Assessment).filter_by(user_id=user.id).all()
    return {"user_id": user.id, "courses_in_progress": len(progress), "average_progress": sum(p.percent_complete for p in progress) / len(progress) if progress else 0, "assessments_taken": len(assessments)}
