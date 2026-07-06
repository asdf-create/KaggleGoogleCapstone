'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Award, TrendingUp, BarChart2 } from 'lucide-react';
import { getAnalytics } from '../../lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProgressView: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>({ quiz_history: [], total_quizzes_taken: 0 });

  useEffect(() => {
    getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const chartData = analytics.quiz_history.map((item: any, i: number) => ({
    name: item.topic || `Quiz ${i + 1}`,
    score: item.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brandBlue flex items-center justify-center border border-blue-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Quizzes Completed</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{analytics.total_quizzes_taken}</p>
          </div>
        </div>

        <div className="liquid-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Average Mastery Score</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">85%</p>
          </div>
        </div>

        <div className="liquid-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Study Streak</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">5 Days 🔥</p>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="liquid-glass p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brandCyan" /> Mastery Score per Topic (%)
          </h3>
        </div>

        <div className="h-72 w-full pt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} fontWeight={600} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
              Take your first quiz to visualize score analytics here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
