'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/ui/header';
import { RoadmapView } from '../components/dashboard/roadmap_view';
import { TutorView } from '../components/study/tutor_view';
import { TranscriptPlayer } from '../components/youtube/transcript_player';
import { QuizView } from '../components/quiz/quiz_view';
import { ProgressView } from '../components/analytics/progress_view';
import { AntigravityVisualizer } from '../components/antigravity/visualizer';
import { getStudyPlans } from '../lib/api';
import { StudyPlan } from '../lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('Gradient Descent');

  useEffect(() => {
    getStudyPlans()
      .then((plans) => {
        if (plans.length > 0) setCurrentPlan(plans[0]);
      })
      .catch(console.error);
  }, []);

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'roadmap' && (
          <RoadmapView
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'tutor' && (
          <TutorView selectedTopic={selectedTopic} />
        )}

        {activeTab === 'youtube' && (
          <TranscriptPlayer />
        )}

        {activeTab === 'quiz' && (
          <QuizView selectedTopic={selectedTopic} />
        )}

        {activeTab === 'analytics' && (
          <ProgressView />
        )}

        {activeTab === 'antigravity' && (
          <AntigravityVisualizer />
        )}
      </main>

      <footer className="glass-panel border-t border-surfaceBorder py-6 text-center text-xs text-gray-500">
        StudyMate AI • Autonomous Multi-Agent Learning Companion • Kaggle AI Agents Capstone Project 2026
      </footer>
    </div>
  );
}
