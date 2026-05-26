"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, Briefcase, ChevronRight } from "lucide-react";

const VeloLogo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="currentColor" />
    <polygon points="3,7 9,7 16,24 20,24 13,7" fill="currentColor" opacity="0.3" />
    <rect x="1" y="28" width="8" height="2" rx="1" fill="currentColor" opacity="0.4" />
  </svg>
);

const features = {
  student: [
    "Encontre instrutores qualificados perto de você",
    "Agende aulas em minutos, sem burocracia",
    "Acompanhe seu progresso até a habilitação",
  ],
  instructor: [
    "Gerencie sua agenda e alunos em um só lugar",
    "Receba pagamentos com segurança via escrow",
    "Controle suas finanças e crescimento mensal",
  ],
};

const inputCls =
  "w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";

export default function LoginPage() {
  const router = useRouter();
  const { login, setUserRole } = useApp();

  const [role, setRole] = useState<"student" | "instructor">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      setUserRole(role);
      await login({ email, password }, role);
      router.push(role === "student" ? "/app/student/dashboard" : "/app/instructor/dashboard");
    } catch (err: any) {
      setError(err?.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const bullets = role === "student" ? features.student : features.instructor;

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden">

      {/* Brand panel */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between p-8 md:p-12 md:w-[45%] lg:w-1/2 md:h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/6 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <VeloLogo size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        {/* Desktop content */}
        <div className="hidden md:block space-y-6 relative z-10">
          <div>
            <h2 className="text-4xl font-bold leading-snug">
              {role === "student" ? "Sua carteira,\nseu futuro." : "Sua carreira,\nseu controle."}
            </h2>
            <p className="text-slate-400 mt-3 text-base leading-relaxed">
              {role === "student"
                ? "Conecte-se aos melhores instrutores da sua região."
                : "Gerencie alunos, agenda e finanças em um só lugar."}
            </p>
          </div>
          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-slate-400">
                <div className="w-4 h-4 bg-blue-600/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs">✓</span>
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden md:block text-slate-600 text-xs relative z-10">© 2025 Velo · Direção segura, futuro certo.</p>

        {/* Mobile: compact tagline */}
        <div className="md:hidden py-4 relative z-10">
          <h2 className="text-2xl font-bold">Bem-vindo de volta.</h2>
          <p className="text-slate-400 mt-1 text-sm">Acesse sua conta para continuar.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex flex-col flex-1 p-6 md:p-12 lg:p-16 justify-center">
          <div className="w-full max-w-sm mx-auto md:mx-0">

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Entrar no Velo</h1>
              <p className="text-slate-500 mt-1 text-sm">Selecione seu perfil e acesse sua conta.</p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["student", "instructor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left ${
                    role === r
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {r === "student"
                    ? <GraduationCap size={18} className={role === r ? "text-blue-600" : "text-slate-400"} />
                    : <Briefcase size={18} className={role === r ? "text-blue-600" : "text-slate-400"} />
                  }
                  <span className="text-sm font-bold">
                    {r === "student" ? "Aluno" : "Instrutor"}
                  </span>
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputCls + " pr-11"}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 font-medium hover:underline underline-offset-2">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Entrando..." : (
                  <>Entrar <ChevronRight size={16} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500 text-center">
              Não tem conta?{" "}
              <Link href="/auth/register" className="text-blue-600 font-bold hover:underline underline-offset-2">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
