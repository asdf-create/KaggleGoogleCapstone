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
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brandEmerald" /> Adaptive Quiz & Assessment Agent
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Test your topic mastery with AI-generated quizzes. Your scores dynamically update tomorrow's study roadmap!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-background border border-surfaceBorder text-xs text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-brandEmerald"
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
            className="bg-background border border-surfaceBorder rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brandEmerald w-full md:w-64"
          />

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-brandEmerald to-brandCyan text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-brandEmerald/20 whitespace-nowrap"
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
            const isSelected = userAnswers[q.id] !== undefined;

            return (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-surfaceBorder space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surfaceBorder">
                  <span className="text-xs font-mono font-bold text-brandEmerald bg-brandEmerald/10 px-2.5 py-1 rounded-md border border-brandEmerald/20">
                    QUESTION {idx + 1} OF {quiz.questions.length}
                  </span>
                  {submitted && (
                    <span className={`text-xs font-semibold flex items-center gap-1 ${isCorrect ? 'text-brandEmerald' : 'text-red-400'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-white leading-relaxed">{q.question_text}</p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const chosen = userAnswers[q.id] === optIdx;
                    let borderClass = 'border-surfaceBorder hover:border-gray-500 bg-surface/50 text-gray-200';
                    if (chosen) borderClass = 'border-brandBlue bg-brandBlue/15 text-white font-semibold';
                    if (submitted) {
                      if (optIdx === q.correct_option_index) {
                        borderClass = 'border-brandEmerald bg-brandEmerald/20 text-white font-bold';
                      } else if (chosen && !isCorrect) {
                        borderClass = 'border-red-500 bg-red-500/20 text-red-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${borderClass}`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${chosen ? 'border-brandBlue bg-brandBlue' : 'border-gray-600'}`}>
                          {chosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3.5 rounded-xl bg-surface/80 border border-surfaceBorder text-xs text-gray-300 space-y-1">
                    <span className="font-bold text-brandCyan block">Explanation:</span>
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brandEmerald to-brandCyan text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-brandEmerald/25"
            >
              Submit Quiz Answers
            </button>
          ) : (
            submissionResult && (
              <div className="glass-panel p-6 rounded-2xl border border-brandEmerald/40 bg-brandEmerald/5 space-y-4 text-center">
                <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-3xl font-black text-brandEmerald">
                  {submissionResult.score} / {submissionResult.total} ({submissionResult.percentage.toFixed(0)}%)
                </p>
                {submissionResult.adapted_plan?.recommendation && (
                  <p className="text-xs text-gray-300 max-w-lg mx-auto bg-surface/80 p-3 rounded-xl border border-surfaceBorder">
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
