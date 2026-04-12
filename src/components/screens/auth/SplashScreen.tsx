"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-velo-blue flex flex-col items-center justify-center text-white z-50"
      onClick={onFinish}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Car size={48} className="text-velo-blue" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Velo</h1>
        <p className="mt-2 text-velo-blue-light text-lg">Direção segura, futuro certo.</p>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-sm opacity-70"
      >
        Toque para começar
      </motion.p>
    </motion.div>
  );
};
