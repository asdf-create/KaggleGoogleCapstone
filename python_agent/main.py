import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from agents.coordinator import CoordinatorAgent

app = FastAPI(
    title="StudyMate AI - Google ADK Agent Microservice",
    description="Multi-agent service powered by Google ADK and Gemini API",
    version="1.0.0"
)

coordinator = CoordinatorAgent()

class PlanRequest(BaseModel):
    goal: str
    total_days: Optional[int] = 30
    hours_per_day: Optional[int] = 2

class TutorRequest(BaseModel):
    topic: str
    user_context: Optional[str] = "Beginner"

class QuizRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "medium"

class ResearchRequest(BaseModel):
    topic: str

class AdaptRequest(BaseModel):
    plan_id: str
    quiz_topic: str
    score: int
    total: int

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "StudyMate Python ADK Microservice",
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    }

@app.post("/plan")
def create_plan(req: PlanRequest):
    return coordinator.handle_plan(req.goal, req.total_days, req.hours_per_day)

@app.post("/tutor")
def explain(req: TutorRequest):
    return coordinator.handle_tutor(req.topic, req.user_context)

@app.post("/quiz")
def generate_quiz(req: QuizRequest):
    return coordinator.handle_quiz(req.topic, req.difficulty)

@app.post("/research")
def research(req: ResearchRequest):
    return coordinator.handle_research(req.topic)

@app.post("/adapt")
def adapt_plan(req: AdaptRequest):
    return coordinator.handle_adapt(req.plan_id, req.quiz_topic, req.score, req.total)

if __name__ == "__main__":
    port = int(os.getenv("PYTHON_ADK_PORT", "5000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
