export interface Task {
  id: string;
  topic: string;
  description: string;
  duration_minutes: number;
  completed: boolean;
}

export interface StudyDay {
  day_number: number;
  title: string;
  tasks: Task[];
}

export interface StudyPlan {
  id: string;
  goal: string;
  total_days: number;
  hours_per_day: number;
  created_at: string;
  schedule: StudyDay[];
}

export interface YouTubeVideo {
  title: string;
  video_id: string;
  url: string;
  channel: string;
  duration: string;
}

export interface TranscriptItem {
  timestamp_seconds: number;
  time_formatted: string;
  text: string;
}

export interface ResourceItem {
  title: string;
  url: string;
  type: string;
  snippet: string;
  relevance_score: number;
  youtube_videos: YouTubeVideo[];
  transcript: TranscriptItem[];
}

export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: string;
  questions: Question[];
}

export interface AgentTrace {
  timestamp: string;
  agent_name: string;
  action: string;
  details: string;
  status: string;
}
