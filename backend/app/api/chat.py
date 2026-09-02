from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from app.ai.chat_service import answer
from app.models.user import User
from app.utils.dependencies import current_user

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


@router.post("")
def chat(payload: ChatRequest, user: User = Depends(current_user)):
    return {"reply": answer(payload.message, user.full_name)}
