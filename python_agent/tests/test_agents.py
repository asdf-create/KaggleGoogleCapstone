import pytest
from agents.coordinator import CoordinatorAgent
from agents.planner import PlannerAgent
from agents.tutor import TutorAgent
from agents.quiz import QuizAgent
from agents.research import ResearchAgent
from agents.progress import ProgressAgent

def test_planner_agent():
    planner = PlannerAgent()
    plan = planner.create_plan("Learn Linear Algebra", total_days=7, hours_per_day=2)
    assert plan["goal"] == "Learn Linear Algebra"
    assert plan["total_days"] == 7
    assert len(plan["schedule"]) > 0

def test_tutor_agent():
    tutor = TutorAgent()
    explanation = tutor.explain_concept("Gradient Descent", user_context="Beginner")
    assert explanation["topic"] == "Gradient Descent"
    assert "explanation" in explanation
    assert len(explanation["key_takeaways"]) > 0

def test_quiz_agent():
    quiz_agent = QuizAgent()
    quiz = quiz_agent.generate_quiz("Linear Algebra", difficulty="medium")
    assert quiz["topic"] == "Linear Algebra"
    assert len(quiz["questions"]) > 0
    assert "options" in quiz["questions"][0]

def test_research_agent_and_youtube_transcripts():
    research = ResearchAgent()
    res = research.search_resources_and_youtube("Machine Learning")
    assert res["topic"] == "Machine Learning"
    assert len(res["resources"]) > 0
    first_res = res["resources"][0]
    assert "youtube_videos" in first_res
    assert "transcript" in first_res
    if first_res["transcript"]:
        assert "timestamp_seconds" in first_res["transcript"][0]
        assert "time_formatted" in first_res["transcript"][0]

def test_progress_agent():
    progress = ProgressAgent()
    res = progress.adapt_roadmap("p1", "Calculus", score=2, total=5)
    assert res["needs_revision"] is True
    assert "Revision" in res["recommendation"] or "revision" in res["recommendation"]

def test_coordinator_agent():
    coord = CoordinatorAgent()
    res = coord.handle_research("Deep Learning")
    assert res["topic"] == "Deep Learning"
