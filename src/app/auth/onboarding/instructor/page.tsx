"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function InstructorOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();

  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [credencial, setCredencial] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const formatCNH = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 11);
  };

  const handleCnhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnh(formatCNH(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 14) {
      setError("CPF incompleto.");
      return;
    }
    if (cnh.length < 11) {
      setError("CNH deve ter 11 dígitos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Saving instructor profile to backend...", {
        role: "INSTRUCTOR",
        cpf: cpf.replace(/\D/g, ""),
        cnh,
        credencial,
        valorHora: Number(valorHora),
        placa,
        modelo,
      });

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role: "INSTRUCTOR", 
          cpf: cpf.replace(/\D/g, ""), 
          cnh, 
          credencial, 
          valorHora: Number(valorHora), 
          veiculo_placa: placa, 
          veiculo_modelo: modelo,
          name: session?.user?.name,
          email: session?.user?.email 
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar no backend");
      }

      router.push("/app/instructor/dashboard");
    } catch (err: any) {
      setError("Erro ao salvar perfil do instrutor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bem-vindo, {session?.user?.name?.split(" ")[0] || "Instrutor"}!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Insira seus dados profissionais e do veículo para aprovação na plataforma.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Seu CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                required
                maxLength={14}
                placeholder="000.000.000-00"
                className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sua CNH
              </label>
              <input
                type="text"
                value={cnh}
                onChange={handleCnhChange}
                required
                maxLength={11}
                placeholder="00000000000"
                className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Credencial DETRAN (Instrutor)
            </label>
            <input
              type="text"
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              required
              placeholder="ABCD-1234"
              className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-5 border-t border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-3">
              Seu Veículo & Valores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Placa
                </label>
                <input
                  type="text"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  required
                  placeholder="ABC-1234"
                  className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  required
                  placeholder="VW Mobi 2022"
                  className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valor cobrado por Hora/Aula (R$)
            </label>
            <input
              type="number"
              value={valorHora}
              onChange={(e) => setValorHora(e.target.value)}
              required
              min="0"
              placeholder="80"
              className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}
