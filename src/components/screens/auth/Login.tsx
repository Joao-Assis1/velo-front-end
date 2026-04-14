"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { UserRole } from '@/types';

export const Login = ({ 
  role, 
  onLogin, 
  onRegister, 
  onBack 
}: { 
  role: UserRole, 
  onLogin: (credentials: any) => void, 
  onRegister: () => void, 
  onBack: () => void 
}) => {
  const isStudent = role === 'student';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white p-6 flex flex-col"
    >
      <button onClick={onBack} className="self-start p-2 -ml-2 text-slate-400 hover:text-slate-600">
        <ArrowLeft size={24} />
      </button>
      
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Login {isStudent ? 'Aluno' : 'Instrutor'}
          </h1>
          <p className="text-slate-500">Entre para continuar sua jornada.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin({ email, password }); }}>
          <Input 
            type="email" 
            placeholder="Seu e-mail" 
            icon={<Mail size={20} />} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="Sua senha" 
            icon={<Lock size={20} />} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="text-right">
            <button type="button" className="text-sm text-velo-blue font-medium hover:underline">
              Esqueceu a senha?
            </button>
          </div>

          <Button type="submit" className="w-full py-4 text-lg mt-4">
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Não tem uma conta?{' '}
            <button onClick={onRegister} className="text-velo-blue font-bold hover:underline">
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
