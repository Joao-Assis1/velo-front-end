"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { ChevronRight, Mail, ArrowLeft } from "lucide-react";

const VeloLogo = () => (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
    <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="currentColor" />
    <polygon points="3,7 9,7 16,24 20,24 13,7" fill="currentColor" opacity="0.3" />
    <rect x="1" y="28" width="8" height="2" rx="1" fill="currentColor" opacity="0.4" />
  </svg>
);

const inputCls =
  "w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-4xl font-bold leading-snug">Esqueceu<br />sua senha?</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Sem problemas. Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        <div className="md:hidden py-4 relative z-10">
          <h2 className="text-2xl font-bold">Recuperar senha</h2>
          <p className="text-slate-400 mt-1 text-sm">Enviaremos um link para seu e-mail.</p>
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

            {success ? (
              <div className="space-y-6">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Mail size={26} className="text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">E-mail enviado!</h1>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    Se esse endereço estiver cadastrado, você receberá um link de redefinição em breve. Verifique também sua caixa de spam.
                  </p>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline underline-offset-2"
                >
                  ← Voltar ao Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Recuperar senha</h1>
                  <p className="text-slate-500 mt-1 text-sm">
                    Informe seu e-mail para receber o link de redefinição.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      E-mail
                    </label>
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? "Enviando..." : <><span>Enviar link</span><ChevronRight size={16} /></>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
