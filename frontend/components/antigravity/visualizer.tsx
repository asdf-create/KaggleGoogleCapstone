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
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brandCyan" /> Antigravity Agent Execution & Subagent Traces
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time multi-agent execution visualizer logging Coordinator, Planner, Tutor, Research, and Quiz agents.
          </p>
        </div>

        <button
          onClick={fetchTraces}
          disabled={loading}
          className="flex items-center gap-2 bg-surface border border-surfaceBorder text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stream
        </button>
      </div>

      {/* Agent Multi-Agent Topology Flow */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Multi-Agent Orchestration Topology</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: 'CoordinatorAgent', role: 'Routes intent & triggers agents', color: 'border-brandBlue text-brandBlue' },
            { name: 'PlannerAgent', role: 'Generates & adapts schedule', color: 'border-brandCyan text-brandCyan' },
            { name: 'TutorAgent', role: 'Delivers personalized explanations', color: 'border-brandPurple text-brandPurple' },
            { name: 'ResearchAgent', role: 'MCP & YouTube transcript finder', color: 'border-amber-400 text-amber-400' },
            { name: 'QuizAgent', role: 'Generates quizzes & evaluates answers', color: 'border-brandEmerald text-brandEmerald' }
          ].map((ag) => (
            <div key={ag.name} className={`p-3.5 rounded-xl bg-surface/50 border ${ag.color} flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">{ag.name}</span>
                <Zap className="w-3 h-3 animate-pulse" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{ag.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Trace Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brandEmerald" /> Antigravity Execution Log Stream
          </h3>
          <span className="text-[10px] font-mono bg-brandEmerald/20 text-brandEmerald px-2.5 py-0.5 rounded border border-brandEmerald/30">
            LIVE MONITORING
          </span>
        </div>

        <div className="bg-black/80 rounded-xl p-4 font-mono text-xs space-y-2 border border-surfaceBorder max-h-96 overflow-y-auto">
          {traces.map((trace, idx) => (
            <div key={idx} className="flex items-start gap-3 text-gray-300 hover:bg-white/5 p-1.5 rounded transition-colors">
              <span className="text-gray-500 text-[10px] shrink-0 font-mono">{trace.timestamp || '2026-07-05 23:00:00'}</span>
              <span className="text-brandBlue font-bold shrink-0">[{trace.agent_name}]</span>
              <span className="text-brandCyan font-bold shrink-0">{trace.action}</span>
              <span className="text-gray-400 flex-1 truncate">{trace.details}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                trace.status === 'SUCCESS' ? 'bg-brandEmerald/20 text-brandEmerald' : 'bg-brandBlue/20 text-brandBlue'
              }`}>
                {trace.status}
              </span>
            </div>
          ))}

          {traces.length === 0 && (
            <p className="text-gray-500 text-center py-6">No execution traces logged yet. Interact with Planner or Quiz agents to view live logs.</p>
          )}
        </div>
      </div>
    </div>
  );
};
