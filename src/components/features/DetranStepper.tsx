"use client";

import React from 'react';
import { Check, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetranStage } from '@/types';

interface DetranStepperProps {
  stages: DetranStage[];
}

export const DetranStepper = ({ stages }: DetranStepperProps) => {
  return (
    <div className="w-full">
      <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        {/* Background Line (Desktop) */}
        <div className="hidden md:block absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-10 mx-10" />

        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const isLocked = stage.status === 'locked';

          return (
            <div key={stage.id} className="flex md:flex-col items-center flex-1 group">
              {/* Step Circle */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shrink-0",
                isCompleted ? "bg-velo-green border-velo-green text-white" :
                isCurrent ? "bg-white border-velo-blue text-velo-blue shadow-lg shadow-velo-blue/20 ring-4 ring-velo-blue/10" :
                "bg-slate-50 border-slate-200 text-slate-400"
              )}>
                {isCompleted ? <Check size={20} strokeWidth={3} /> :
                 isCurrent ? <Play size={18} fill="currentColor" /> :
                 <Lock size={16} />}
              </div>

              {/* Label */}
              <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center px-2">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-0.5 transition-colors",
                  isCurrent ? "text-velo-blue" : "text-slate-400"
                )}>
                  Etapa {index + 1}
                </p>
                <p className={cn(
                  "text-xs font-bold leading-tight transition-colors",
                  isCurrent ? "text-slate-900" : 
                  isCompleted ? "text-slate-600" : "text-slate-400"
                )}>
                  {stage.label}
                </p>
              </div>

              {/* Connector Line (Mobile) */}
              {index < stages.length - 1 && (
                <div className="md:hidden absolute left-5 mt-10 w-0.5 h-6 bg-slate-200 -z-10" 
                     style={{ top: `${index * 68 + 40}px` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
