from fastapi import APIRouter

router = APIRouter(
    prefix="/career",
    tags=["career"]
)


@router.get("/")
def get_careers():
    return {
        "message": "Career API is working",
        "careers": [
            {
                "id": 1,
                "title": "AI Engineer",
                "description": "Build AI and machine learning solutions."
            },
            {
                "id": 2,
                "title": "Machine Learning Engineer",
                "description": "Develop and deploy machine learning models."
            },
            {
                "id": 3,
                "title": "Data Scientist",
                "description": "Analyze data and build predictive models."
            },
            {
                "id": 4,
                "title": "Cybersecurity Analyst",
                "description": "Monitor systems and investigate security threats."
            }
        ]
    }