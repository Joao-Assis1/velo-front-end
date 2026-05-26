"use client";

import React from 'react';
import { motion } from 'motion/react';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50 overflow-hidden"
      onClick={onFinish}
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/6 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Logo card */}
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="#2563eb" />
            <polygon points="3,7 9,7 16,24 20,24 13,7" fill="#1d4ed8" opacity="0.3" />
            <rect x="1" y="28" width="8" height="2" rx="1" fill="#2563eb" opacity="0.4" />
          </svg>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white">VELO</h1>
        <p className="mt-2 text-blue-400 text-base">Direção segura, futuro certo.</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-xs text-white/30 tracking-widest uppercase"
      >
        Toque para começar
      </motion.p>
    </motion.div>
  );
};
