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
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brandBlue/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandBlue/10 border border-brandBlue/30 text-brandBlue text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Learning Planner Agent
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">What do you want to learn today?</h2>
          <p className="text-sm text-gray-400 mt-1">
            Specify your goal and timeline. StudyMate AI will generate a daily structured roadmap with tasks, resource search, and adaptive quizzes.
          </p>

          <form onSubmit={handleCreatePlan} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Learning Goal / Exam Prep</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master Machine Learning in 30 days"
                className="w-full bg-background border border-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brandBlue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Target Timeline (Days)</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  min={1}
                  max={180}
                  className="w-full bg-background border border-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brandBlue"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Daily Study Budget (Hours/Day)</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="w-full bg-background border border-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brandBlue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-brandBlue to-brandCyan text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-brandBlue/25"
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
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-brandBlue" /> Roadmap: {currentPlan.goal}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brandCyan" /> {currentPlan.total_days} Days</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brandPurple" /> {currentPlan.hours_per_day} Hours/Day</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlan.schedule.map((day) => (
              <div key={day.day_number} className="glass-panel p-5 rounded-2xl border border-surfaceBorder hover:border-brandBlue/40 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder mb-3">
                  <span className="text-xs font-mono font-bold text-brandBlue bg-brandBlue/10 px-2.5 py-1 rounded-md border border-brandBlue/20">
                    DAY {day.day_number}
                  </span>
                  <span className="text-[10px] text-gray-400">{day.tasks.length} Tasks</span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1 mb-3">{day.title}</h4>

                <div className="space-y-2">
                  {day.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTopic(task.topic)}
                      className="p-2.5 rounded-xl bg-surface/50 border border-surfaceBorder hover:border-gray-500 cursor-pointer transition-all flex items-start gap-2 group"
                    >
                      <Circle className="w-3.5 h-3.5 text-gray-500 mt-0.5 group-hover:text-brandBlue transition-colors" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-200 group-hover:text-white">{task.topic}</p>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{task.description}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
