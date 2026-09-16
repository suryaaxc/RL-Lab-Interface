import React from 'react';
import { cn } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';

export const LabEnvironment: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { settings } = useSettings();
  const gridOpacity = (settings.gridOpacity / 100) * 0.15;
  
  return (
    <div 
      className={cn("w-screen h-screen blueprint-grid flex items-center justify-center p-4 md:p-6 lg:p-8", className)}
      style={{ '--grid-opacity': gridOpacity } as React.CSSProperties}
    >
      <div className="relative w-full h-full max-w-[1600px] max-h-[1000px] flex flex-col md:flex-row gap-6">
        {children}
      </div>
    </div>
  );
};
