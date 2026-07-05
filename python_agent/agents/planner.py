import os
import json
from google import genai
from google.genai import types

class PlannerAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if self.api_key and self.api_key != "mock_key_for_testing":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def create_plan(self, goal: str, total_days: int = 30, hours_per_day: int = 2) -> dict:
        if not self.client:
            # Fallback structure when offline
            schedule = []
            topics = [f"Foundations of {goal}", f"Core Algorithms in {goal}", f"Advanced Applications & Projects in {goal}"]
            days_per_topic = max(1, total_days // len(topics))
            
            day_cnt = 1
            for t in topics:
                for d in range(days_per_topic):
                    if day_cnt > total_days:
                        break
                    schedule.append({
                        "day_number": day_cnt,
                        "title": f"Day {day_cnt}: {t} (Part {d+1})",
                        "tasks": [
                            {"id": f"t_{day_cnt}_1", "topic": t, "description": f"Read notes and watch lecture on {t}", "duration_minutes": 60, "completed": False},
                            {"id": f"t_{day_cnt}_2", "topic": t, "description": f"Solve practice exercises for {t}", "duration_minutes": 60, "completed": False}
                        ]
                    })
                    day_cnt += 1

            return {
                "goal": goal,
                "total_days": total_days,
                "hours_per_day": hours_per_day,
                "schedule": schedule
            }

        try:
            prompt = f"""
            Act as an expert AI Study Planner. Create a detailed {total_days}-day study roadmap for the goal: '{goal}'.
            Target study time is {hours_per_day} hours/day.
            Output JSON format:
            {{
              "goal": "{goal}",
              "total_days": {total_days},
              "hours_per_day": {hours_per_day},
              "schedule": [
                 {{
                    "day_number": 1,
                    "title": "Day 1 Title",
                    "tasks": [
                       {{ "id": "t1", "topic": "Topic", "description": "Details", "duration_minutes": 60, "completed": false }}
                    ]
                 }}
              ]
            }}
            """
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)
        except Exception:
            return self.create_plan(goal, total_days, hours_per_day)
