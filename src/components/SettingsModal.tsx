import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Grid, Zap } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl text-slate-800"
          >
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-600">
                <Settings className="w-5 h-5" /> LAB CONFIGURATION
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-slate-600 font-bold uppercase tracking-wider">
                  <Grid className="w-4 h-4 text-blue-500" /> BLUEPRINT GRID OPACITY
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.gridOpacity}
                  onChange={(e) => updateSettings({ gridOpacity: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2 appearance-none outline-none"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>0%</span>
                  <span>{settings.gridOpacity}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-slate-600 font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" /> SIMULATION MULTIPLIER
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.5, 1, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateSettings({ simSpeed: speed })}
                      className={`py-2 px-4 rounded-lg border font-mono transition-all ${
                        settings.simSpeed === speed
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-mono text-slate-400 text-center">
              SETTINGS PERSISTED TO LOCAL_STORAGE
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
