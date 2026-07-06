'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Calendar, Clock, CheckCircle2, Circle, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { createStudyPlan } from '../../lib/api';
import { StudyPlan } from '../../lib/types';

interface RoadmapViewProps {
  currentPlan: StudyPlan | null;
  setCurrentPlan: (plan: StudyPlan) => void;
  onSelectTopic: (topic: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentPlan, setCurrentPlan, onSelectTopic }) => {
  const [goal, setGoal] = useState('Master Machine Learning & Linear Algebra');
  const [days, setDays] = useState(30);
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plan = await createStudyPlan(goal, days, hours);
      setCurrentPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Goal Input Form */}
      <div className="liquid-glass p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brandBlue text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Learning Planner Agent
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">What do you want to learn today?</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Specify your goal and timeline. StudyMate AI will generate a daily structured roadmap with tasks, resource search, and adaptive quizzes.
          </p>

          <form onSubmit={handleCreatePlan} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Learning Goal / Exam Prep</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master Machine Learning in 30 days"
                className="w-full liquid-glass-input rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Timeline (Days)</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  min={1}
                  max={180}
                  className="w-full liquid-glass-input rounded-2xl px-4 py-3 text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Daily Study Budget (Hours/Day)</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="w-full liquid-glass-input rounded-2xl px-4 py-3 text-sm text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 liquid-glass-button text-white px-6 py-3 rounded-2xl font-bold text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate AI Study Plan
            </button>
          </form>
        </div>
      </div>

      {/* Generated Roadmap Display */}
      {currentPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-brandBlue" /> Roadmap: {currentPlan.goal}
            </h3>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
                <Calendar className="w-3.5 h-3.5" /> {currentPlan.total_days} Days
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-700">
                <Clock className="w-3.5 h-3.5" /> {currentPlan.hours_per_day} Hours/Day
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlan.schedule.map((day) => (
              <div key={day.day_number} className="liquid-glass-card p-5 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg border border-blue-200">
                      DAY {day.day_number}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{day.tasks.length} Tasks</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-3">{day.title}</h4>

                  <div className="space-y-2">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onSelectTopic(task.topic)}
                        className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-start gap-2.5 group shadow-sm hover:shadow-md"
                      >
                        <Circle className="w-4 h-4 text-slate-400 mt-0.5 group-hover:text-brandBlue transition-colors shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-brandBlue">{task.topic}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brandBlue shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
