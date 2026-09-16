import React from 'react';
import { AgentState } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { BrainCircuit } from 'lucide-react';

interface NeuralActivationsProps {
  agentState: AgentState;
}

const LAYERS = [4, 8, 8, 4]; 

export const NeuralActivations: React.FC<NeuralActivationsProps> = ({ agentState }) => {
  return (
    <div className="flex-1 flex flex-col glass-panel p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <span className="flex items-center gap-2 text-blue-600"><BrainCircuit size={16} /> POLICY_NET_ACTIVATIONS</span>
        <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">FWD_PASS</span>
      </div>

      <div className="flex-1 relative flex items-center justify-between px-10 bg-slate-50/50 rounded-xl border border-slate-100 py-4">
        {LAYERS.map((nodeCount, layerIdx) => (
          <div key={`layer-${layerIdx}`} className="flex flex-col gap-6 z-10">
            {Array.from({ length: nodeCount }).map((_, nodeIdx) => {
              const isPulsing = agentState.isHighReward;
              const pathActive = isPulsing && (
                 (layerIdx === 0 && nodeIdx === 1) ||
                 (layerIdx === 1 && nodeIdx % 2 === 0) ||
                 (layerIdx === 2 && nodeIdx % 3 === 0) ||
                 (layerIdx === LAYERS.length - 1 && nodeIdx === 2)
              );
              const isNormallyActive = !isPulsing && Math.sin(agentState.tick * layerIdx + nodeIdx) > 0.5;

              return (
                <motion.div
                  key={`node-${layerIdx}-${nodeIdx}`}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 bg-white",
                    isNormallyActive ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" : "border-slate-300",
                    pathActive ? "high-reward-pulse bg-white border-amber-500" : ""
                  )}
                  animate={{
                     scale: pathActive ? 1.6 : (isNormallyActive ? 1.2 : 1)
                  }}
                />
              );
            })}
          </div>
        ))}

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {LAYERS.map((count, i) => {
            if (i === LAYERS.length - 1) return null;
            const nextCount = LAYERS[i+1];
            return (
              <g key={`lines-${i}`}>
                {Array.from({length: count}).map((_, n1) => (
                  Array.from({length: nextCount}).map((_, n2) => {
                    const isPulsing = agentState.isHighReward;
                    const isPath = isPulsing && (
                       (i === 0 && n1 === 1 && n2 % 2 === 0) ||
                       (i === 1 && n1 % 2 === 0 && n2 % 3 === 0) ||
                       (i === 2 && n1 % 3 === 0 && n2 === 2)
                    );
                    return (
                      <line 
                        key={`l-${n1}-${n2}`}
                        x1={`${(i / (LAYERS.length - 1)) * 100}%`}
                        y1={`${(n1 + 1) / (count + 1) * 100}%`}
                        x2={`${((i+1) / (LAYERS.length - 1)) * 100}%`}
                        y2={`${(n2 + 1) / (nextCount + 1) * 100}%`}
                        stroke={isPath ? "#f59e0b" : "#e2e8f0"}
                        strokeWidth={isPath ? "2" : "1"}
                        className={cn("transition-colors duration-300")}
                        opacity={isPath ? 1 : 0.6}
                      />
                    );
                  })
                ))}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  );
};
