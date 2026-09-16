import React, { useState } from 'react';
import { AgentState } from '../types';
import { Cpu, Loader2, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAnalystProps {
  agentState: AgentState;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ agentState }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: agentState.score,
          tick: agentState.tick,
          recentActions: agentState.recentActions,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze');
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-[1] glass-panel p-4 flex flex-col relative overflow-hidden min-h-[160px]">
      <div className="flex justify-between items-center mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span className="flex items-center gap-2 text-blue-600"><Cpu size={16} /> DIAGNOSTIC_UNIT</span>
        <button 
          onClick={handleAnalyze} 
          disabled={loading || agentState.tick === 0}
          className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-full disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <PlayCircle size={12} />}
          RUN_ANALYSIS
        </button>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex-1 overflow-y-auto shadow-inner">
        {loading ? (
          <div className="text-slate-400 font-mono text-xs space-y-1 animate-pulse">
            <div>[SYS] INITIALIZING NEURAL UPLINK...</div>
            <div>[SYS] TRANSFERRING TELEMETRY DATA...</div>
            <div>[SYS] AWAITING DIAGNOSTIC RESPONSE...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 font-mono text-xs bg-red-50 p-2 rounded border border-red-100">
            [ERROR]: {error}
          </div>
        ) : analysis ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-700 font-mono text-xs leading-relaxed"
          >
            <span className="text-blue-500 font-bold mr-2">&gt;</span>{analysis}
          </motion.div>
        ) : (
          <div className="text-slate-400 font-mono text-xs italic flex h-full items-center justify-center">
            SYSTEM IDLE. AWAITING MANUAL OVERRIDE.
          </div>
        )}
      </div>
    </div>
  );
};
