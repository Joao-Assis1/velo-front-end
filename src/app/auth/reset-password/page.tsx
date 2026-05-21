"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth";

const VeloLogo = () => (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
    <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="currentColor" />
    <polygon points="3,7 9,7 16,24 20,24 13,7" fill="currentColor" opacity="0.3" />
    <rect x="1" y="28" width="8" height="2" rx="1" fill="currentColor" opacity="0.4" />
  </svg>
);

const inputCls =
  "w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExpiredLink, setShowExpiredLink] = useState(false);

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
          Link inválido ou expirado.
        </div>
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-bold hover:underline underline-offset-2"
        >
          Solicitar novo link →
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowExpiredLink(false);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordAction(token, password);
      if (result.success) {
        router.push("/auth/login");
      } else {
        setError("Link expirado. Solicite um novo.");
        setShowExpiredLink(true);
      }
    } catch {
      setError("Link expirado. Solicite um novo.");
      setShowExpiredLink(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="space-y-3">
          <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
          {showExpiredLink && (
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-bold hover:underline underline-offset-2"
            >
              Solicitar novo link →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              className={inputCls + " pr-11"}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
            Confirmar nova senha
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repita a nova senha"
              className={inputCls + " pr-11"}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg"
              aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? "Redefinindo..." : <><span>Redefinir senha</span><ChevronRight size={16} /></>}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden">

      {/* Brand panel */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between p-8 md:p-12 md:w-[45%] lg:w-1/2 md:h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/6 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <VeloLogo />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        <div className="hidden md:block space-y-4 relative z-10">
          <h2 className="text-4xl font-bold leading-snug">Crie uma<br />nova senha.</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Use uma senha forte com pelo menos 6 caracteres. Você será redirecionado para o login após a redefinição.
          </p>
        </div>

        <div className="md:hidden py-4 relative z-10">
          <h2 className="text-2xl font-bold">Redefinir senha</h2>
          <p className="text-slate-400 mt-1 text-sm">Crie uma nova senha para sua conta.</p>
        </div>

        <p className="hidden md:block text-slate-600 text-xs relative z-10">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex flex-col flex-1 p-6 md:p-12 lg:p-16 justify-center">
          <div className="w-full max-w-sm mx-auto md:mx-0">

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-8 -ml-0.5"
            >
              <ArrowLeft size={16} />
              Voltar ao Login
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Redefinir senha</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Crie uma nova senha para acessar sua conta.
              </p>
            </div>

            <Suspense fallback={null}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
