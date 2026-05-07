"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message || "Erro ao registrar usuário");
        return;
      }

      // Sucesso no Neon Auth! Agora redirecionamos para o Onboarding correto
      // onde a tabela User e o Perfil (Student/Instructor) serão preenchidos
      // no backend NestJS.
      if (role === "STUDENT") {
        router.push("/auth/onboarding/student");
      } else {
        router.push("/auth/onboarding/instructor");
      }
    } catch (err: any) {
      setError("Erro interno ao tentar criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Criar conta no VELO
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Eu sou um...
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-2 border rounded font-medium ${
                  role === "STUDENT"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
                onClick={() => setRole("STUDENT")}
              >
                Aluno
              </button>
              <button
                type="button"
                className={`flex-1 py-2 border rounded font-medium ${
                  role === "INSTRUCTOR"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
                onClick={() => setRole("INSTRUCTOR")}
              >
                Instrutor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 mt-4"
          >
            {loading ? "Criando..." : "Criar Conta"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
