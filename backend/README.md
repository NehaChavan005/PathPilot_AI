# PathPilot AI backend

FastAPI service for learner profiles, skills, recommendations, roadmaps, progress,
assessments, and chat.

## Run

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the API documentation.
