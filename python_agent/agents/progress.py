class ProgressAgent:
    def adapt_roadmap(self, plan_id: str, quiz_topic: str, score: int, total: int) -> dict:
        percentage = (score / total * 100.0) if total > 0 else 0.0
        
        needs_revision = percentage < 70.0
        recommendation = ""
        if needs_revision:
            recommendation = f"Score is {percentage:.1f}%. Adding 1 revision day and additional YouTube deep-dive videos for '{quiz_topic}'."
        else:
            recommendation = f"Mastery level achieved ({percentage:.1f}%). Proceeding to advanced topics on schedule!"

        return {
            "plan_id": plan_id,
            "quiz_topic": quiz_topic,
            "score": score,
            "total": total,
            "percentage": percentage,
            "needs_revision": needs_revision,
            "recommendation": recommendation
        }
