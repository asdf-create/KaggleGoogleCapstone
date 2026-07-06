'use client';

import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { generateQuiz, submitQuiz } from '../../lib/api';
import { Quiz } from '../../lib/types';

interface QuizViewProps {
  selectedTopic: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ selectedTopic }) => {
  const [topic, setTopic] = useState(selectedTopic || 'Linear Algebra');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    setSubmissionResult(null);
    try {
      const q = await generateQuiz(topic, difficulty);
      setQuiz(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    let score = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_option_index) {
        score++;
      }
    });

    try {
      const res = await submitQuiz(quiz.id, quiz.topic, score, quiz.questions.length);
      setSubmissionResult(res);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> Adaptive Quiz & Assessment Agent
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Test your topic mastery with AI-generated quizzes. Your scores dynamically update tomorrow's study roadmap!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="liquid-glass-input text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Quiz topic..."
            className="liquid-glass-input rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium w-full md:w-64"
          />

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Quiz
          </button>
        </div>
      </div>

      {/* Quiz Runner */}
      {quiz && (
        <div className="max-w-3xl mx-auto space-y-6">
          {quiz.questions.map((q, idx) => {
            const isCorrect = userAnswers[q.id] === q.correct_option_index;

            return (
              <div key={q.id} className="liquid-glass p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    QUESTION {idx + 1} OF {quiz.questions.length}
                  </span>
                  {submitted && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.question_text}</p>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const chosen = userAnswers[q.id] === optIdx;
                    let borderClass = 'border-slate-200 bg-white hover:border-slate-400 text-slate-800';
                    if (chosen) borderClass = 'border-blue-500 bg-blue-50 text-blue-900 font-semibold shadow-sm';
                    if (submitted) {
                      if (optIdx === q.correct_option_index) {
                        borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (chosen && !isCorrect) {
                        borderClass = 'border-rose-400 bg-rose-50 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-center justify-between ${borderClass}`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${chosen ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                          {chosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-cyan-800 block">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Button & Results */}
          {!submitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(userAnswers).length < quiz.questions.length}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:opacity-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              Submit Quiz Answers
            </button>
          ) : (
            submissionResult && (
              <div className="liquid-glass p-8 rounded-3xl border border-emerald-300 bg-emerald-50/50 space-y-4 text-center">
                <h3 className="text-xl font-bold text-slate-900">Quiz Completed!</h3>
                <p className="text-3xl font-black text-emerald-700">
                  {submissionResult.score} / {submissionResult.total} ({submissionResult.percentage.toFixed(0)}%)
                </p>
                {submissionResult.adapted_plan?.recommendation && (
                  <p className="text-xs text-slate-700 max-w-lg mx-auto bg-white p-4 rounded-2xl border border-slate-200 font-medium">
                    💡 <strong>Adaptive Planner Agent Notice:</strong> {submissionResult.adapted_plan.recommendation}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
