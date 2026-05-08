"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-velo-blue rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-black italic text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Recuperar senha</h1>
          <p className="text-sm text-slate-500 mt-1">
            Informe seu e-mail para receber o link de redefinição
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100 text-center">
            Se esse e-mail estiver cadastrado, você receberá um link em breve.
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-velo-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-slate-500">
          <Link href="/auth/login" className="text-velo-blue font-bold hover:underline">
            ← Voltar ao Login
          </Link>
        </p>
      </div>
    </div>
  );
}
