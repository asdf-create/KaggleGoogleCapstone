import os
import json
from google import genai
from google.genai import types

class QuizAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if self.api_key and self.api_key != "mock_key_for_testing":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def generate_quiz(self, topic: str, difficulty: str = "medium") -> dict:
        if not self.client:
            return {
                "topic": topic,
                "difficulty": difficulty,
                "questions": [
                    {
                        "id": "q1",
                        "question_text": f"What is the core function of {topic}?",
                        "options": [
                            "To slow down model training",
                            f"To optimize and solve problems related to {topic}",
                            "To delete unused memory",
                            "To convert text into binary"
                        ],
                        "correct_option_index": 1,
                        "explanation": f"The primary goal of {topic} is to optimize algorithmic efficiency."
                    },
                    {
                        "id": "q2",
                        "question_text": f"Which hyperparameter most directly influences {topic} convergence?",
                        "options": [
                            "Learning Rate",
                            "Batch Size",
                            "Number of CPU Cores",
                            "File Compression Ratio"
                        ],
                        "correct_option_index": 0,
                        "explanation": "Learning rate controls the step size taken during iterative optimization."
                    }
                ]
            }

        try:
            prompt = f"""
            Generate a 3-question adaptive quiz for '{topic}' with difficulty '{difficulty}'.
            Output JSON format:
            {{
               "topic": "{topic}",
               "difficulty": "{difficulty}",
               "questions": [
                  {{
                     "id": "q1",
                     "question_text": "Question?",
                     "options": ["A", "B", "C", "D"],
                     "correct_option_index": 0,
                     "explanation": "Why correct"
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
            return self.generate_quiz(topic, difficulty)
