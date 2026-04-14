"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, MessageCircle, CheckCircle2, Car, Lock, Loader2, CreditCard } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { createStudentAction } from '@/lib/actions/students';
import { CreateStudentSchema } from '@/lib/validations';

export const Register = ({ 
  role, 
  onRegister, 
  onBack 
}: { 
  role: UserRole, 
  onRegister: (data: any) => void, 
  onBack: () => void 
}) => {
  const isStudent = role === 'student';
  const [instructorType, setInstructorType] = useState<'Credenciado' | 'Autônomo'>('Credenciado');
  const [ladvFile, setLadvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const authData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        password: formData.password,
        ladvUploaded: !!ladvFile,
        profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      };

      // Let context handle the Auth and token storage
      await onRegister(authData);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="text-red-500 rotate-180" size={20} />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <Input 
            type="text" 
            placeholder="Nome completo" 
            icon={<User size={20} />} 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input 
            type="email" 
            placeholder="Seu e-mail" 
            icon={<Mail size={20} />} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input 
            type="tel" 
            placeholder="Celular (WhatsApp)" 
            icon={<MessageCircle size={20} />} 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          
          <Input 
            type="text" 
            placeholder="CPF" 
            icon={<CreditCard size={20} />} 
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            required
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input 
            type="password" 
            placeholder="Confirme a senha" 
            icon={<Lock size={20} />} 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <Button 
            className="w-full py-4 text-lg mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Cadastrando...
              </div>
            ) : 'Cadastrar'}
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
