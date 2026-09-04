from fastapi import APIRouter


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/status")
def auth_status():
    return {
        "authentication": "JWT enabled",
        "message": "JWT authentication is active."
    }
