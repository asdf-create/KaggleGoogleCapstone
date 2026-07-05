'use client';

import React from 'react';
import { Sparkles, Cpu, Compass, BookOpen, Video, Award, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'roadmap', label: 'Study Roadmap', icon: Compass },
    { id: 'tutor', label: 'AI Tutor', icon: BookOpen },
    { id: 'youtube', label: 'YouTube & Transcripts', icon: Video },
    { id: 'quiz', label: 'Adaptive Quiz', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'antigravity', label: 'Agent Traces', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-surfaceBorder px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandBlue to-brandCyan flex items-center justify-center shadow-lg shadow-brandBlue/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            StudyMate <span className="text-xs px-2 py-0.5 rounded-full bg-brandPurple/20 text-brandPurple border border-brandPurple/30 font-mono">AI AGENT</span>
          </h1>
          <p className="text-xs text-gray-400">Autonomous Learning Manager • Kaggle Capstone</p>
        </div>
      </div>

      <nav className="flex items-center gap-1 bg-surface/80 p-1.5 rounded-xl border border-surfaceBorder">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brandBlue text-white shadow-md shadow-brandBlue/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
