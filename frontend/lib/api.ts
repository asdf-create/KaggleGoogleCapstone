import { StudyPlan, Quiz, AgentTrace, ResourceItem } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createStudyPlan(goal: string, total_days: number = 30, hours_per_day: number = 2): Promise<StudyPlan> {
  const res = await fetch(`${API_BASE}/api/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, total_days, hours_per_day }),
  });
  if (!res.ok) throw new Error('Failed to create study plan');
  return res.json();
}

export async function getStudyPlans(): Promise<StudyPlan[]> {
  const res = await fetch(`${API_BASE}/api/plans`);
  if (!res.ok) return [];
  return res.json();
}

export async function explainConcept(topic: string, user_context: string = 'Beginner') {
  const res = await fetch(`${API_BASE}/api/tutor/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, user_context }),
  });
  if (!res.ok) throw new Error('Failed to explain concept');
  return res.json();
}

export async function generateQuiz(topic: string, difficulty: string = 'medium'): Promise<Quiz> {
  const res = await fetch(`${API_BASE}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty }),
  });
  if (!res.ok) throw new Error('Failed to generate quiz');
  return res.json();
}

export async function submitQuiz(quiz_id: string, topic: string, score: number, total: number, plan_id?: string) {
  const res = await fetch(`${API_BASE}/api/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quiz_id, topic, score, total, plan_id }),
  });
  if (!res.ok) throw new Error('Failed to submit quiz');
  return res.json();
}

export async function fetchResearchResources(topic: string): Promise<{ topic: string; summary: string; resources: ResourceItem[] }> {
  const res = await fetch(`${API_BASE}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error('Failed to fetch research resources');
  return res.json();
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`);
  if (!res.ok) return { quiz_history: [], total_quizzes_taken: 0 };
  return res.json();
}

export async function getAgentTraces(): Promise<AgentTrace[]> {
  const res = await fetch(`${API_BASE}/api/antigravity/traces`);
  if (!res.ok) return [];
  return res.json();
}
