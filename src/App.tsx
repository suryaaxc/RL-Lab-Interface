import React, { useState } from 'react';
import { useAgentSimulation } from './hooks/useAgentSimulation';
import { LabEnvironment } from './components/LabEnvironment';
import { GameScreen } from './components/GameScreen';
import { MctsTree } from './components/MctsTree';
import { NeuralActivations } from './components/NeuralActivations';
import { SettingsProvider } from './contexts/SettingsContext';
import { SettingsModal } from './components/SettingsModal';
import { AIAnalyst } from './components/AIAnalyst';
import { Settings } from 'lucide-react';

function Dashboard() {
  const { state: agentState, isPaused, togglePause, stepForward } = useAgentSimulation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <LabEnvironment>
      {/* Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-0 right-0 md:top-8 md:right-8 z-50 p-2.5 bg-white border border-slate-200 text-slate-500 rounded-full shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Settings size={20} />
      </button>

      {/* Left Pane - Game View & AI Insight */}
      <div className="w-full md:w-1/2 h-full flex flex-col gap-6">
        <GameScreen 
          agentState={agentState} 
          isPaused={isPaused} 
          onTogglePause={togglePause} 
          onStep={stepForward} 
        />
        <AIAnalyst agentState={agentState} />
      </div>

      {/* Right Pane - Analysis Views */}
      <div className="w-full md:w-1/2 h-full flex flex-col gap-6">
        <MctsTree agentState={agentState} />
        <NeuralActivations agentState={agentState} />
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </LabEnvironment>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Dashboard />
    </SettingsProvider>
  );
}
