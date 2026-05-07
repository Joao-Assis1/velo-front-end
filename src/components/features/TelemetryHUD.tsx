"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Signal, SignalHigh, SignalLow, Timer, Map, Navigation, WifiOff } from 'lucide-react';
import { SwipeButton } from '@/components/ui-custom/SwipeButton';
import { cn } from '@/lib/utils';

interface TelemetryHUDProps {
  onFinish: () => void;
  studentName: string;
}

export const TelemetryHUD = ({ onFinish, studentName }: TelemetryHUDProps) => {
  const [seconds, setSeconds] = useState(50 * 60); // 50 minutes
  const [gpsStatus, setGpsStatus] = useState<'strong' | 'weak' | 'none'>('strong');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const gpsSim = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) setGpsStatus('none');
      else if (rand > 0.8) setGpsStatus('weak');
      else setGpsStatus('strong');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(gpsSim);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-[100] flex flex-col p-6 safe-area-inset">
      {/* HUD Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-red-500">Gravando Telemetria</span>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          {gpsStatus === 'strong' && <SignalHigh className="text-velo-green" size={20} />}
          {gpsStatus === 'weak' && <SignalLow className="text-amber-500" size={20} />}
          {gpsStatus === 'none' && <WifiOff className="text-red-500" size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">Sinal GPS</span>
        </div>
      </header>

      {/* Main Display */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-2">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Cronômetro de Aula</p>
          <h1 className="text-[80px] md:text-[120px] font-black tabular-nums leading-none tracking-tighter">
            {formatTime(seconds)}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left">
            <Navigation className="text-velo-blue mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocidade</p>
            <p className="text-3xl font-black italic">24 <span className="text-sm not-italic opacity-40">km/h</span></p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left">
            <Map className="text-velo-blue mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Distância</p>
            <p className="text-3xl font-black italic">4.2 <span className="text-sm not-italic opacity-40">km</span></p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aluno em instrução</p>
          <p className="text-xl font-bold">{studentName}</p>
        </div>
      </main>

      {/* Footer / Action */}
      <footer className="mt-auto pt-8">
        <SwipeButton 
          text="Deslize para finalizar" 
          successText="Aula Finalizada" 
          onSwipe={onFinish} 
          className="max-w-md mx-auto"
        />
        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">
          Em conformidade com a portaria DETRAN nº 123/2024
        </p>
      </footer>
    </div>
  );
};
