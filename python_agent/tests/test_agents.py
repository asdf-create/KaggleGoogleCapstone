import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from main import app
from agents.coordinator import CoordinatorAgent
from agents.planner import PlannerAgent
from agents.tutor import TutorAgent
from agents.quiz import QuizAgent
from agents.research import ResearchAgent
from agents.progress import ProgressAgent

client = TestClient(app)

def test_fastapi_health_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "model" in data

def test_fastapi_plan_endpoint():
    response = client.post("/plan", json={"goal": "Learn Deep Learning", "total_days": 14, "hours_per_day": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["goal"] == "Learn Deep Learning"
    assert data["total_days"] == 14
    assert len(data["schedule"]) > 0

def test_fastapi_tutor_endpoint():
    response = client.post("/tutor", json={"topic": "Neural Networks", "user_context": "Intermediate"})
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Neural Networks"
    assert "explanation" in data
    assert len(data["key_takeaways"]) > 0

def test_fastapi_quiz_endpoint():
    response = client.post("/quiz", json={"topic": "Backpropagation", "difficulty": "hard"})
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Backpropagation"
    assert len(data["questions"]) > 0

def test_fastapi_research_and_youtube_transcripts_endpoint():
    response = client.post("/research", json={"topic": "Transformers & Attention"})
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Transformers & Attention"
    assert len(data["resources"]) > 0
    first_res = data["resources"][0]
    assert len(first_res["youtube_videos"]) > 0
    assert len(first_res["transcript"]) > 0
    # Verify timestamp structure
    ts = first_res["transcript"][0]
    assert "timestamp_seconds" in ts
    assert "time_formatted" in ts
    assert "text" in ts

def test_fastapi_adapt_endpoint():
    response = client.post("/adapt", json={"plan_id": "p123", "quiz_topic": "Attention Mechanisms", "score": 1, "total": 4})
    assert response.status_code == 200
    data = response.json()
    assert data["needs_revision"] is True
    assert data["percentage"] == 25.0

def test_planner_edge_cases():
    planner = PlannerAgent()
    # Test high day count
    plan = planner.create_plan("Quantum Computing", total_days=60, hours_per_day=4)
    assert plan["total_days"] == 60
    assert len(plan["schedule"]) == 60

def test_progress_agent_scoring():
    progress = ProgressAgent()
    # High score -> no revision needed
    res_high = progress.adapt_roadmap("p1", "Topic", score=5, total=5)
    assert res_high["needs_revision"] is False
    assert "Mastery level achieved" in res_high["recommendation"]

    # Low score -> revision needed
    res_low = progress.adapt_roadmap("p1", "Topic", score=2, total=5)
    assert res_low["needs_revision"] is True
    assert "Adding 1 revision day" in res_low["recommendation"]
