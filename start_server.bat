@echo off
set PYTHONPATH=F:\PathPilot_AI
"F:\PathPilot_AI\venv\Scripts\python.exe" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
