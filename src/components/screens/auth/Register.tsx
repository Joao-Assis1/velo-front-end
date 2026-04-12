"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, MessageCircle, CheckCircle2, Car, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

export const Register = ({ 
  role, 
  onRegister, 
  onBack 
}: { 
  role: UserRole, 
  onRegister: (hasLadv?: boolean) => void, 
  onBack: () => void 
}) => {
  const isStudent = role === 'student';
  const [instructorType, setInstructorType] = useState<'Credenciado' | 'Autônomo'>('Credenciado');
  const [ladvFile, setLadvFile] = useState<File | null>(null);

  const handleRegister = () => {
    onRegister(!!ladvFile);
  };

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
      
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Criar Conta {isStudent ? 'Aluno' : 'Instrutor'}
          </h1>
          <p className="text-slate-500">Preencha seus dados para começar.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <Input 
            type="text" 
            placeholder="Nome completo" 
            icon={<User size={20} />} 
          />
          <Input 
            type="email" 
            placeholder="Seu e-mail" 
            icon={<Mail size={20} />} 
          />
          <Input 
            type="tel" 
            placeholder="Celular (WhatsApp)" 
            icon={<MessageCircle size={20} />} 
          />
          
          {isStudent ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">LADV (Opcional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.png" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setLadvFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  {ladvFile ? (
                    <>
                      <CheckCircle2 className="text-velo-green" size={24} />
                      <span className="text-sm font-medium text-slate-900">{ladvFile.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="text-sm">Toque para enviar foto ou PDF</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400">Necessário apenas para agendar aulas.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInstructorType('Credenciado')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    instructorType === 'Credenciado' ? "bg-white text-velo-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Credenciado
                </button>
                <button
                  type="button"
                  onClick={() => setInstructorType('Autônomo')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    instructorType === 'Autônomo' ? "bg-white text-velo-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Autônomo
                </button>
              </div>

              <Input 
                type="text" 
                placeholder="Modelo do Veículo" 
                icon={<Car size={20} />} 
              />
              
              {instructorType === 'Credenciado' && (
                <Input 
                  type="text" 
                  placeholder="Número da Credencial (CFC)" 
                  icon={<CheckCircle2 size={20} />} 
                />
              )}
            </>
          )}

          <Input 
            type="password" 
            placeholder="Crie uma senha" 
            icon={<Lock size={20} />} 
          />
          <Input 
            type="password" 
            placeholder="Confirme a senha" 
            icon={<Lock size={20} />} 
          />

          <Button className="w-full py-4 text-lg mt-6">
            Cadastrar
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Já tem uma conta?{' '}
            <button onClick={onBack} className="text-velo-blue font-bold hover:underline">
              Faça Login
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
