from agents.planner import PlannerAgent
from agents.tutor import TutorAgent
from agents.quiz import QuizAgent
from agents.research import ResearchAgent
from agents.progress import ProgressAgent

class CoordinatorAgent:
    def __init__(self):
        self.planner = PlannerAgent()
        self.tutor = TutorAgent()
        self.quiz = QuizAgent()
        self.research = ResearchAgent()
        self.progress = ProgressAgent()

    def handle_plan(self, goal: str, total_days: int, hours_per_day: int) -> dict:
        return self.planner.create_plan(goal, total_days, hours_per_day)

    def handle_tutor(self, topic: str, user_context: str) -> dict:
        return self.tutor.explain_concept(topic, user_context)

    def handle_quiz(self, topic: str, difficulty: str) -> dict:
        return self.quiz.generate_quiz(topic, difficulty)

    def handle_research(self, topic: str) -> dict:
        return self.research.search_resources_and_youtube(topic)

    def handle_adapt(self, plan_id: str, quiz_topic: str, score: int, total: int) -> dict:
        return self.progress.adapt_roadmap(plan_id, quiz_topic, score, total)
