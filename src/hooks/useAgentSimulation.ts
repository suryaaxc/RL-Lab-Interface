import { useState, useEffect, useCallback } from 'react';
import { AgentState } from '../types';
import { useSettings } from '../contexts/SettingsContext';

const ACTIONS = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'FIRE', 'NO-OP'];

export function useAgentSimulation() {
  const { settings } = useSettings();
  const [state, setState] = useState<AgentState>({
    tick: 0,
    score: 0,
    lastReward: 0,
    action: 'NO-OP',
    isHighReward: false,
    recentActions: [],
    epsilon: 1.0,
  });
  
  const [isPaused, setIsPaused] = useState(false);

  const performTick = useCallback(() => {
    setState(prev => {
      const isHighReward = Math.random() > 0.85; // 15% chance of a high reward
      const reward = isHighReward ? Math.floor(Math.random() * 50) + 10 : 0;
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const newActions = [...prev.recentActions, action].slice(-10);
      
      // Epsilon decay simulation
      const epsilon = Math.max(0.01, 1.0 * Math.pow(0.995, prev.tick + 1));
      
      return {
        tick: prev.tick + 1,
        score: prev.score + reward,
        lastReward: reward,
        action,
        isHighReward,
        recentActions: newActions,
        epsilon,
      };
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const baseInterval = 800;
    const intervalMs = baseInterval / settings.simSpeed;

    const interval = setInterval(performTick, intervalMs);

    return () => clearInterval(interval);
  }, [settings.simSpeed, isPaused, performTick]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const stepForward = useCallback(() => {
    if (isPaused) {
      performTick();
    }
  }, [isPaused, performTick]);

  return { state, isPaused, togglePause, stepForward };
}
