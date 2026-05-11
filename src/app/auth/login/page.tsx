"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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
      // Set role in context so login() knows which endpoint to hit
      setUserRole(role);
      await login({ email, password }, role);

      router.push(role === "student" ? "/app/student/dashboard" : "/app/instructor/dashboard");
    } catch (err: any) {
      setError(err?.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-velo-blue rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-black italic text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Entrar no Velo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acesse sua conta como aluno ou instrutor
          </p>
        </div>

        {/* Role selector */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {(["student", "instructor"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                role === r
                  ? "bg-white text-velo-blue shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r === "student" ? "Aluno" : "Instrutor"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velo-blue/30 focus:border-velo-blue transition"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 pr-11 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velo-blue/30 focus:border-velo-blue transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 text-slate-400 hover:text-velo-blue transition-colors rounded-lg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-velo-blue font-medium hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-velo-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link
            href="/auth/register"
            className="text-velo-blue font-bold hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
