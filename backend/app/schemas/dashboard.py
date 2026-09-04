from pydantic import BaseModel


class DashboardRead(BaseModel):
    user_id: int
    courses_enrolled: int
    courses_completed: int
    courses_in_progress: int
    average_progress: float
    assessments_taken: int
