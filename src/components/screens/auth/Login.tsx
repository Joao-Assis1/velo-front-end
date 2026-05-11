"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff, Car, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { UserRole } from '@/types';

const features = {
  student: [
    'Encontre instrutores qualificados perto de você',
    'Agende aulas em minutos, sem burocracia',
    'Acompanhe seu progresso até a habilitação',
  ],
  instructor: [
    'Gerencie sua agenda e alunos em um só lugar',
    'Receba pagamentos com segurança via escrow',
    'Controle suas finanças e crescimento mensal',
  ],
};

export const Login = ({
  role,
  onLogin,
  onRegister,
  onBack,
}: {
  role: UserRole;
  onLogin: (credentials: any, role?: any) => Promise<void>;
  onRegister: () => void;
  onBack: () => void;
}) => {
  const isStudent = role === 'student';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await onLogin({ email, password }, role);
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const bullets = isStudent ? features.student : features.instructor;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex md:h-screen md:overflow-hidden"
    >
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 bg-velo-blue flex-col justify-between p-12 text-white shrink-0 md:h-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Car size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-snug">
              {isStudent
                ? 'Sua carteira,\nseu futuro.'
                : 'Sua carreira,\nseu controle.'}
            </h2>
            <p className="text-blue-200 mt-3 text-base leading-relaxed">
              {isStudent
                ? 'Conecte-se aos melhores instrutores da sua região e garanta sua habilitação.'
                : 'Gerencie alunos, agenda e finanças em um só lugar.'}
            </p>
          </div>

          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-blue-100">
                <CheckCircle2 size={16} className="text-blue-300 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-blue-400 text-xs">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        <div className="flex flex-col flex-1 p-6 md:p-12 lg:p-16">

          <button
            onClick={onBack}
            className="self-start flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-8 md:mb-12 -ml-1"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto md:mx-0">
            <div className="mb-8">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-8 md:hidden">
                <div className="w-8 h-8 bg-velo-blue rounded-xl flex items-center justify-center">
                  <Car size={16} className="text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter text-slate-900">VELO</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Entrar como {isStudent ? 'Aluno' : 'Instrutor'}
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm">
                Bem-vindo de volta. Acesse sua conta para continuar.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            >
              <Input
                type="email"
                placeholder="Seu e-mail"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                icon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-velo-blue transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <div className="text-right">
                <button type="button" className="text-sm text-velo-blue font-medium hover:underline underline-offset-2">
                  Esqueceu a senha?
                </button>
              </div>

              <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={18} />
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </Button>
            </form>

            <p className="mt-6 text-sm text-slate-500 text-center md:text-left">
              Não tem uma conta?{' '}
              <button onClick={onRegister} className="text-velo-blue font-bold hover:underline underline-offset-2">
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
