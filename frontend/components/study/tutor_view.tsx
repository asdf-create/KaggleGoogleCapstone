'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Send, CheckCircle, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { explainConcept } from '../../lib/api';

interface TutorViewProps {
  selectedTopic: string;
}

export const TutorView: React.FC<TutorViewProps> = ({ selectedTopic }) => {
  const [topic, setTopic] = useState(selectedTopic || 'Gradient Descent');
  const [userContext, setUserContext] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const res = await explainConcept(topic, userContext);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brandPurple" /> AI Tutor & Personalized Concept Explainer
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Get structured explanations adapted to your background, complete with key takeaways and practice steps.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            className="liquid-glass-input text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="Beginner">Beginner Level</option>
            <option value="Intermediate">Intermediate Level</option>
            <option value="Advanced">Advanced Level</option>
          </select>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic to learn..."
            className="liquid-glass-input rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium w-full md:w-64"
          />

          <button
            onClick={handleExplain}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 hover:opacity-95 transition-all whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Explain
          </button>
        </div>
      </div>

      {/* Explanation Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 liquid-glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brandCyan" /> {result.topic}
              </h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-mono font-semibold">
                {result.user_context} Mode
              </span>
            </div>

            <div className="prose text-sm text-slate-700 whitespace-pre-line leading-relaxed font-normal">
              {result.explanation}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Key Takeaways */}
            <div className="liquid-glass p-5 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Key Takeaways
              </h4>
              <div className="space-y-2">
                {result.key_takeaways?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white/70 p-2.5 rounded-2xl border border-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="liquid-glass p-5 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Next Recommended Steps</h4>
              <div className="space-y-2">
                {result.recommended_next_steps?.map((step: string, i: number) => (
                  <div key={i} className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between hover:border-blue-400 transition-all">
                    <span>{step}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brandBlue" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
