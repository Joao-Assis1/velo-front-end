"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function StudentOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();

  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Mocks para simular uploads e biometria
  const [ladvUploaded, setLadvUploaded] = useState(false);
  const [biometryDone, setBiometryDone] = useState(false);

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

  const handleSubmit = async () => {
    if (!cpf || cpf.length < 14 || !ladvUploaded || !biometryDone) {
      setError("Por favor, preencha o CPF corretamente e conclua as validações.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Saving student profile to backend...", {
        role: "STUDENT",
        cpf: cpf.replace(/\D/g, ""), // backend usually expects raw numbers
      });

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role: "STUDENT", 
          cpf: cpf.replace(/\D/g, ""),
          name: session?.user?.name,
          email: session?.user?.email 
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar no backend");
      }

      router.push("/app/student/dashboard");
    } catch (err: any) {
      setError("Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bem-vindo, {session?.user?.name?.split(" ")[0] || "Aluno"}!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Precisamos validar sua identidade (E-KYC) para liberar as aulas.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Seu CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="block w-full px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={cpf.length < 14}
              className="w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center rounded-lg bg-slate-50 transition-colors hover:bg-slate-100">
              <h3 className="text-sm font-medium text-slate-900 mb-3">
                1. Licença de Aprendizagem (LADV)
              </h3>
              {ladvUploaded ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-medium text-sm">
                  <span>✓ LADV Anexada</span>
                </div>
              ) : (
                <button
                  onClick={() => setLadvUploaded(true)}
                  className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-md text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Simular Upload PDF
                </button>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center rounded-lg bg-slate-50 transition-colors hover:bg-slate-100">
              <h3 className="text-sm font-medium text-slate-900 mb-3">
                2. Reconhecimento Facial (Liveness)
              </h3>
              {biometryDone ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-medium text-sm">
                  <span>✓ Rosto Verificado</span>
                </div>
              ) : (
                <button
                  onClick={() => setBiometryDone(true)}
                  className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-md text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Simular Scan Facial
                </button>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-8">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto py-3 sm:py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!ladvUploaded || !biometryDone || loading}
                className="w-full sm:w-auto py-3 sm:py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Validando..." : "Concluir Onboarding"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
