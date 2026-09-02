from .auth import router as auth_router
from .profile import router as profile_router
from .skills import router as skills_router
from .recommendations import router as recommendations_router
from .roadmap import router as roadmap_router
from .progress import router as progress_router
from .assessment import router as assessment_router
from .chat import router as chat_router
from .dashboard import router as dashboard_router
from .feedback import router as feedback_router

routers = [auth_router, profile_router, skills_router, recommendations_router, roadmap_router,
           progress_router, assessment_router, chat_router, dashboard_router, feedback_router]
