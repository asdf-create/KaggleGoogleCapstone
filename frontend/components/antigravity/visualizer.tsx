'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Play, Zap } from 'lucide-react';
import { getAgentTraces } from '../../lib/api';
import { AgentTrace } from '../../lib/types';

export const AntigravityVisualizer: React.FC = () => {
  const [traces, setTraces] = useState<AgentTrace[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTraces = async () => {
    setLoading(true);
    try {
      const data = await getAgentTraces();
      setTraces(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraces();
    const interval = setInterval(fetchTraces, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brandCyan" /> Antigravity Agent Execution & Subagent Traces
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time multi-agent execution visualizer logging Coordinator, Planner, Tutor, Research, and Quiz agents.
          </p>
        </div>

        <button
          onClick={fetchTraces}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stream
        </button>
      </div>

      {/* Agent Multi-Agent Topology Flow */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Multi-Agent Orchestration Topology</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: 'CoordinatorAgent', role: 'Routes intent & triggers agents', color: 'border-blue-300 bg-blue-50/70 text-blue-800' },
            { name: 'PlannerAgent', role: 'Generates & adapts schedule', color: 'border-cyan-300 bg-cyan-50/70 text-cyan-800' },
            { name: 'TutorAgent', role: 'Delivers personalized explanations', color: 'border-purple-300 bg-purple-50/70 text-purple-800' },
            { name: 'ResearchAgent', role: 'MCP & YouTube transcript finder', color: 'border-amber-300 bg-amber-50/70 text-amber-800' },
            { name: 'QuizAgent', role: 'Generates quizzes & evaluates answers', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-800' }
          ].map((ag) => (
            <div key={ag.name} className={`p-4 rounded-2xl border ${ag.color} flex flex-col justify-between shadow-sm`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold">{ag.name}</span>
                <Zap className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <p className="text-[10px] font-medium text-slate-600 mt-2">{ag.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Trace Stream */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-700" /> Antigravity Execution Log Stream
          </h3>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            LIVE MONITORING
          </span>
        </div>

        <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800 max-h-96 overflow-y-auto">
          {traces.map((trace, idx) => (
            <div key={idx} className="flex items-start gap-3 text-slate-300 hover:bg-white/10 p-2 rounded-xl transition-colors">
              <span className="text-slate-500 text-[10px] shrink-0 font-mono">{trace.timestamp || '2026-07-06 10:00:00'}</span>
              <span className="text-blue-400 font-bold shrink-0">[{trace.agent_name}]</span>
              <span className="text-cyan-400 font-bold shrink-0">{trace.action}</span>
              <span className="text-slate-300 flex-1 truncate">{trace.details}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                trace.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
              }`}>
                {trace.status}
              </span>
            </div>
          ))}

          {traces.length === 0 && (
            <p className="text-slate-500 text-center py-6">No execution traces logged yet. Interact with Planner or Quiz agents to view live logs.</p>
          )}
        </div>
      </div>
    </div>
  );
};
