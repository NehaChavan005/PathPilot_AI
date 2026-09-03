from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.app.services.feedback_service import feedback_received

router = APIRouter(prefix="/feedback", tags=["feedback"])


class FeedbackRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


@router.post("")
def submit_feedback(payload: FeedbackRequest):
    return feedback_received(payload.message)
