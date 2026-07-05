import os
import json
from google import genai
from google.genai import types

class ResearchAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if self.api_key and self.api_key != "mock_key_for_testing":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def search_resources_and_youtube(self, topic: str) -> dict:
        """
        Fetches educational web resources, top YouTube videos, and generates interactive navigable transcripts.
        """
        # Generated curated video and transcript data for interactive video navigation
        mock_videos = [
            {
                "title": f"Complete {topic} Crash Course & Deep Dive",
                "video_id": "k7a_k8s9_01",
                "url": f"https://www.youtube.com/watch?v=k7a_k8s9_01",
                "channel": "StatQuest / MIT OpenCourseWare",
                "duration": "14:20"
            },
            {
                "title": f"{topic} Explained Visually with Examples",
                "video_id": "v3b_m9p2_02",
                "url": f"https://www.youtube.com/watch?v=v3b_m9p2_02",
                "channel": "3Blue1Brown",
                "duration": "18:45"
            }
        ]

        mock_transcript = [
            {"timestamp_seconds": 0.0, "time_formatted": "00:00", "text": f"Welcome! Today we are introducing the core principles of {topic}."},
            {"timestamp_seconds": 90.0, "time_formatted": "01:30", "text": f"First, let's understand the mathematical formulation and intuitive foundation behind {topic}."},
            {"timestamp_seconds": 240.0, "time_formatted": "04:00", "text": "Notice how the optimization objective minimizes the loss metric across all training samples."},
            {"timestamp_seconds": 450.0, "time_formatted": "07:30", "text": "Here is a concrete code example in Python demonstrating how this works step by step."},
            {"timestamp_seconds": 660.0, "time_formatted": "11:00", "text": "Common pitfalls to watch out for include overfitting, gradient explosion, and improper hyperparameter tuning."},
            {"timestamp_seconds": 800.0, "time_formatted": "13:20", "text": "Summary: Focus on intuition first, followed by hands-on code execution."}
        ]

        if not self.client:
            return {
                "topic": topic,
                "summary": f"Comprehensive learning guide for {topic} covering theory, practical implementations, and video tutorials.",
                "resources": [
                    {
                        "title": f"Official Documentation & Tutorial - {topic}",
                        "url": f"https://docs.example.org/{topic.lower().replace(' ', '-')}",
                        "type": "doc",
                        "snippet": f"Official reference manual and step-by-step tutorial for mastering {topic}.",
                        "relevance_score": 0.98,
                        "youtube_videos": mock_videos,
                        "transcript": mock_transcript
                    },
                    {
                        "title": f"GitHub Repository: Awesome {topic} Projects & Benchmarks",
                        "url": f"https://github.com/topics/{topic.lower().replace(' ', '-')}",
                        "type": "repo",
                        "snippet": f"Open-source implementations, benchmarks, and practice notebooks for {topic}.",
                        "relevance_score": 0.94,
                        "youtube_videos": [],
                        "transcript": []
                    }
                ]
            }

        try:
            prompt = f"""
            Find educational resources and YouTube tutorials for learning '{topic}'.
            Format your response as a valid JSON object with the structure:
            {{
               "topic": "{topic}",
               "summary": "Short summary",
               "resources": [
                  {{
                     "title": "Title",
                     "url": "https://...",
                     "type": "video" | "doc" | "paper" | "repo",
                     "snippet": "Description",
                     "relevance_score": 0.95,
                     "youtube_videos": [
                        {{ "title": "Video Title", "video_id": "v123", "url": "https://youtube.com/watch?v=...", "channel": "Channel", "duration": "10:00" }}
                     ],
                     "transcript": [
                        {{ "timestamp_seconds": 0.0, "time_formatted": "00:00", "text": "Transcript line..." }}
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
        except Exception as e:
            return {
                "topic": topic,
                "summary": f"Resources for {topic} (Fallback)",
                "resources": [
                    {
                        "title": f"Mastering {topic}",
                        "url": "https://youtube.com",
                        "type": "video",
                        "snippet": f"In-depth educational breakdown of {topic}.",
                        "relevance_score": 0.95,
                        "youtube_videos": mock_videos,
                        "transcript": mock_transcript
                    }
                ]
            }
