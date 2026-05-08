"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth";

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
      <div className="space-y-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center">
          Link inválido ou expirado.
        </div>
        <p className="text-center text-sm text-slate-500">
          <Link
            href="/auth/forgot-password"
            className="text-velo-blue font-bold hover:underline"
          >
            Solicitar novo link
          </Link>
        </p>
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
    <div className="space-y-6">
      {error && (
        <div className="space-y-3">
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
          {showExpiredLink && (
            <p className="text-center text-sm text-slate-500">
              <Link
                href="/auth/forgot-password"
                className="text-velo-blue font-bold hover:underline"
              >
                Solicitar novo link
              </Link>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-sm font-bold text-slate-700">
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
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velo-blue/30 focus:border-velo-blue transition"
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700">
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
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velo-blue/30 focus:border-velo-blue transition"
              placeholder="Repita a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
            >
              {showConfirm ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-velo-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-velo-blue rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-black italic text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Redefinir senha</h1>
          <p className="text-sm text-slate-500 mt-1">
            Crie uma nova senha para acessar sua conta
          </p>
        </div>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-sm text-slate-500">
          <Link href="/auth/login" className="text-velo-blue font-bold hover:underline">
            ← Voltar ao Login
          </Link>
        </p>
      </div>
    </div>
  );
}
