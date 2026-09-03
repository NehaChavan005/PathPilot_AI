from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/career",
    tags=["career"]
)


class CareerRequest(BaseModel):
    skills: list[str]
    interests: list[str] = []


@router.get("/")
def get_careers():
    return {
        "message": "Career API is working"
    }


@router.post("/recommend")
def recommend_career(data: CareerRequest):

    skills = [skill.lower() for skill in data.skills]
    interests = [interest.lower() for interest in data.interests]

    recommendations = []

    # AI / Machine Learning
    if any(
        keyword in skills + interests
        for keyword in ["python", "machine learning", "ml", "ai", "artificial intelligence"]
    ):
        recommendations.append({
            "career": "AI / Machine Learning Engineer",
            "reason": "Your skills and interests match AI and machine learning."
        })

    # Data Science
    if any(
        keyword in skills + interests
        for keyword in ["python", "data science", "statistics", "pandas", "data analysis"]
    ):
        recommendations.append({
            "career": "Data Scientist",
            "reason": "Your skills indicate an interest in data analysis and predictive modeling."
        })

    # Cybersecurity
    if any(
        keyword in skills + interests
        for keyword in ["cybersecurity", "security", "networking", "linux", "soc", "splunk"]
    ):
        recommendations.append({
            "career": "Cybersecurity Analyst",
            "reason": "Your skills and interests match cybersecurity and security operations."
        })

    # Software Development
    if any(
        keyword in skills + interests
        for keyword in ["java", "javascript", "react", "fastapi", "flask", "web development"]
    ):
        recommendations.append({
            "career": "Software Developer",
            "reason": "Your technical skills match software and web development."
        })

    if not recommendations:
        recommendations.append({
            "career": "Explore Multiple Career Paths",
            "reason": "More information about your skills and interests is needed."
        })

    return {
        "skills": data.skills,
        "interests": data.interests,
        "recommendations": recommendations
    }
