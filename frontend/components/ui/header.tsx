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
    <header className="sticky top-0 z-50 liquid-glass border-b border-slate-200/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandBlue to-brandCyan flex items-center justify-center shadow-md shadow-brandBlue/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            StudyMate <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 font-mono font-semibold">AI AGENT</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Autonomous Learning Manager • Kaggle Capstone</p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-brandBlue shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brandBlue' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
