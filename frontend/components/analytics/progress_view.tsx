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
        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brandBlue/20 text-brandBlue flex items-center justify-center border border-brandBlue/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Quizzes Completed</p>
            <p className="text-2xl font-bold text-white mt-0.5">{analytics.total_quizzes_taken}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brandEmerald/20 text-brandEmerald flex items-center justify-center border border-brandEmerald/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Average Mastery Score</p>
            <p className="text-2xl font-bold text-white mt-0.5">85%</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brandPurple/20 text-brandPurple flex items-center justify-center border border-brandPurple/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Study Streak</p>
            <p className="text-2xl font-bold text-white mt-0.5">5 Days 🔥</p>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brandCyan" /> Mastery Score per Topic (%)
          </h3>
        </div>

        <div className="h-72 w-full pt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1f293d', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs">
              Take your first quiz to visualize score analytics here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
