import React, { useEffect, useRef, useState } from 'react';
import { AgentState } from '../types';
import { motion } from 'motion/react';
import { Gamepad2, Activity, Play, Pause, StepForward } from 'lucide-react';
import { cn } from '../lib/utils';

interface GameScreenProps {
  agentState: AgentState;
  isPaused: boolean;
  onTogglePause: () => void;
  onStep: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ agentState, isPaused, onTogglePause, onStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [entities, setEntities] = useState<{x: number, y: number, type: 'player' | 'enemy' | 'particle' | 'ghost'}[]>([]);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setEntities(prev => {
      let newEntities = prev.filter(e => e.type !== 'particle' && e.type !== 'ghost' || Math.random() > 0.5);
      
      let player = newEntities.find(e => e.type === 'player');
      
      if (agentState.action === 'UP') newEntities.forEach(e => e.type === 'player' && (e.y = Math.max(10, e.y - 10)));
      if (agentState.action === 'DOWN') newEntities.forEach(e => e.type === 'player' && (e.y = Math.min(90, e.y + 10)));
      if (agentState.action === 'LEFT') newEntities.forEach(e => e.type === 'player' && (e.x = Math.max(10, e.x - 10)));
      if (agentState.action === 'RIGHT') newEntities.forEach(e => e.type === 'player' && (e.x = Math.min(90, e.x + 10)));

      // Generate a predicted path (ghosts)
      if (player) {
         let gx = player.x;
         let gy = player.y;
         const predictedActions = ['UP', 'RIGHT', 'RIGHT', 'DOWN', 'RIGHT']; // Mock MCTS path
         for(let act of predictedActions) {
            if (act === 'UP') gy -= 10;
            if (act === 'DOWN') gy += 10;
            if (act === 'LEFT') gx -= 10;
            if (act === 'RIGHT') gx += 10;
            newEntities.push({ x: gx, y: gy, type: 'ghost' });
         }
      }

      if (agentState.isHighReward) {
        for(let i=0; i<10; i++) {
          newEntities.push({ x: Math.random() * 100, y: Math.random() * 100, type: 'particle' });
        }
      }

      if (!newEntities.find(e => e.type === 'player')) {
        newEntities.push({ x: 50, y: 50, type: 'player' });
      }

      if (Math.random() > 0.7 && newEntities.filter(e => e.type === 'enemy').length < 5) {
        newEntities.push({ x: Math.random() * 100, y: Math.random() * 100, type: 'enemy' });
      }
      return newEntities;
    });
  }, [agentState.tick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = (time: DOMHighResTimeStamp) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)'; // Slate 900 with trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      entities.forEach(entity => {
        if (entity.type === 'player') {
          ctx.fillStyle = '#3b82f6'; // Blue
          ctx.fillRect((entity.x / 100) * canvas.width, (entity.y / 100) * canvas.height, 20, 20);
          // Inner core
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect((entity.x / 100) * canvas.width + 4, (entity.y / 100) * canvas.height + 4, 12, 12);
        } else if (entity.type === 'ghost') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // faint white ghost
          ctx.fillRect((entity.x / 100) * canvas.width + 4, (entity.y / 100) * canvas.height + 4, 12, 12);
        } else if (entity.type === 'enemy') {
          ctx.fillStyle = '#ef4444'; // Red
          ctx.beginPath();
          ctx.arc((entity.x / 100) * canvas.width, (entity.y / 100) * canvas.height, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#f59e0b'; // Amber particle
          ctx.fillRect((entity.x / 100) * canvas.width, (entity.y / 100) * canvas.height, 4, 4);
        }
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [entities]);

  return (
    <div className="flex-[3] flex flex-col glass-panel p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span className="flex items-center gap-2 text-blue-600"><Gamepad2 size={16} /> APERTURE_RL_TEST_BED</span>
        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">SYS.ONLINE</span>
      </div>
      
      <div className="flex-1 relative border border-slate-200 rounded-xl bg-slate-900 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
         <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full h-full object-contain filter contrast-125 saturate-150"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay HUD */}
        <div className="absolute top-4 left-4 text-white font-mono font-bold text-xl drop-shadow-md">
          SCORE: {agentState.score.toString().padStart(6, '0')}
        </div>

        {/* Performance Dashboard */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200/50 p-3 rounded-lg text-slate-700 font-mono text-sm z-20 flex flex-col gap-1.5 shadow-lg min-w-[130px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold">FPS:</span>
            <span className="font-semibold text-blue-600">{fps}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold">STEP:</span>
            <span className="font-semibold">{agentState.tick}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold">EPS:</span>
            <span className="font-semibold text-amber-500">{agentState.epsilon.toFixed(3)}</span>
          </div>
        </div>
        
        {/* Action Flash */}
        <motion.div 
          key={agentState.tick}
          initial={{ opacity: 0.9, scale: 1.2, y: 10 }}
          animate={{ opacity: 0, scale: 1, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 right-6 text-white font-black text-2xl tracking-widest drop-shadow-lg"
        >
          {agentState.action}
        </motion.div>
      </div>

      <div className="h-14 mt-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-4 gap-6 text-sm font-mono shadow-sm">
         <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold">ENV_TICK</span>
            <span className="text-slate-700 font-semibold">{agentState.tick.toString().padStart(8, '0')}</span>
         </div>
         <div className="flex flex-col border-l border-slate-200 pl-6">
            <span className="text-slate-400 text-[10px] font-bold">REWARD_SIGNAL</span>
            <span className={cn("transition-colors duration-300 font-semibold", agentState.isHighReward ? "text-amber-500" : "text-slate-700")}>
              +{agentState.lastReward.toFixed(2)}
            </span>
         </div>
         
         {/* Simulation Controls */}
         <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1 shadow-sm">
              <button 
                onClick={onTogglePause} 
                className={cn("p-1.5 rounded transition-colors", isPaused ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "hover:bg-slate-100 text-slate-500")}
                title={isPaused ? "Resume Simulation" : "Pause Simulation"}
              >
                {isPaused ? <Play size={16} className="fill-current" /> : <Pause size={16} className="fill-current" />}
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button 
                onClick={onStep} 
                disabled={!isPaused}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Step Forward (Frame)"
              >
                <StepForward size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold">
              <Activity size={14} className={cn("transition-all duration-300", !isPaused ? (agentState.isHighReward ? "text-amber-500 animate-pulse" : "text-blue-500") : "text-slate-300")} />
              {isPaused ? <span className="text-slate-400">PAUSED</span> : <span className="text-blue-600">ACTIVE</span>}
            </div>
         </div>
      </div>
    </div>
  );
};
