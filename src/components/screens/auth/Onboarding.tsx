"use client";

import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui-custom';
import { UserRole } from '@/types';

export const Onboarding = ({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col p-6 bg-white"
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-velo-blue-light rounded-full flex items-center justify-center mb-8">
          <User size={40} className="text-velo-blue" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Bem-vindo ao Velo</h2>
        <p className="text-slate-500 mb-12 max-w-xs">
          Conectamos você aos melhores instrutores ou aos alunos que precisam da sua experiência.
        </p>

        <div className="w-full space-y-4 max-w-sm">
          <Button 
            className="w-full text-lg py-4" 
            onClick={() => onSelectRole('student')}
          >
            Sou Aluno
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-lg py-4" 
            onClick={() => onSelectRole('instructor')}
          >
            Sou Instrutor
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
