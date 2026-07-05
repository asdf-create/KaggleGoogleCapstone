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
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brandPurple" /> AI Tutor & Personalized Concept Explainer
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Get structured explanations adapted to your background, complete with key takeaways and practice steps.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            className="bg-background border border-surfaceBorder text-xs text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-brandPurple"
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
            className="bg-background border border-surfaceBorder rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brandPurple w-full md:w-64"
          />

          <button
            onClick={handleExplain}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-brandPurple to-brandBlue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-brandPurple/20 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Explain
          </button>
        </div>
      </div>

      {/* Explanation Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-surfaceBorder space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brandCyan" /> {result.topic}
              </h3>
              <span className="text-xs bg-brandPurple/20 text-brandPurple px-2.5 py-1 rounded-md border border-brandPurple/30 font-mono">
                {result.user_context} Mode
              </span>
            </div>

            <div className="prose prose-invert text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {result.explanation}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Key Takeaways */}
            <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Key Takeaways
              </h4>
              <div className="space-y-2">
                {result.key_takeaways?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                    <CheckCircle className="w-3.5 h-3.5 text-brandEmerald mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Next Recommended Steps</h4>
              <div className="space-y-2">
                {result.recommended_next_steps?.map((step: string, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-surface/50 border border-surfaceBorder text-xs text-gray-300 flex items-center justify-between">
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
