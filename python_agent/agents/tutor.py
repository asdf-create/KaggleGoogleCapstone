import os
import json
from google import genai
from google.genai import types

class TutorAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if self.api_key and self.api_key != "mock_key_for_testing":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def explain_concept(self, topic: str, user_context: str = "Beginner") -> dict:
        if not self.client:
            return {
                "topic": topic,
                "user_context": user_context,
                "explanation": f"### Understanding {topic}\n\n**{topic}** is a fundamental concept in computing and AI.\n\n#### Key Intuition\nThink of {topic} like a step-by-step optimization algorithm that improves performance through experience.",
                "key_takeaways": [
                    f"Core mathematical foundation of {topic}",
                    "Practical Python implementations",
                    "Common debugging & optimization strategies"
                ],
                "recommended_next_steps": [
                    f"Solve 3 practice exercises on {topic}",
                    f"Generate a quiz to test your understanding of {topic}"
                ]
            }

        try:
            prompt = f"""
            Act as a world-class AI Tutor. Provide a clear, intuitive, and highly engaging explanation for '{topic}'.
            User experience level: {user_context}.
            Output JSON format:
            {{
               "topic": "{topic}",
               "user_context": "{user_context}",
               "explanation": "Markdown formatted text",
               "key_takeaways": ["Takeaway 1", "Takeaway 2"],
               "recommended_next_steps": ["Step 1", "Step 2"]
            }}
            """
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)
        except Exception:
            return self.explain_concept(topic, user_context)
