"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { maskDate } from "@/lib/utils/masks";
import { parseBRDate, brDateToISO } from "@/lib/utils/dates";

const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

function isValidCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (n: number) =>
    d.slice(0, n).split("").reduce((s, v, i) => s + +v * (n + 1 - i), 0);
  const d1 = (calc(9) * 10) % 11 % 10;
  const d2 = (calc(10) * 10) % 11 % 10;
  return d1 === +d[9] && d2 === +d[10];
}

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1 — Acesso
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 — Dados pessoais (CONTRAN 1.020/25)
  cpf: string;
  phone: string;
  birthDate: string;
  motherName: string;
  ufDomicile: string;
  intendedCategory: "B" | "";
  // Step 3 — Termos e LADV
  termsAccepted: boolean;
  ladvSimulated: boolean;
}

const INITIAL: FormData = {
  name: "", email: "", password: "", confirmPassword: "",
  cpf: "", phone: "", birthDate: "", motherName: "", ufDomicile: "", intendedCategory: "B",
  termsAccepted: false, ladvSimulated: false,
};

function mask(value: string, pattern: string) {
  let i = 0;
  const v = value.replace(/\D/g, "");
  return pattern.replace(/#/g, () => v[i++] || "").replace(/[#-]+$/, "");
}

export default function StudentRegisterPage() {
  const router = useRouter();
  const { register, setUserRole } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  // --- Validations per step ---
  const validateStep1 = () => {
    if (!form.name.trim() || form.name.trim().split(" ").length < 2)
      return "Informe nome e sobrenome.";
    if (!form.email.includes("@")) return "E-mail inválido.";
    if (form.password.length < 6) return "Senha deve ter mínimo 6 caracteres.";
    if (form.password !== form.confirmPassword) return "As senhas não coincidem.";
    return null;
  };

  const validateStep2 = () => {
    if (!isValidCPF(form.cpf)) return "CPF inválido.";
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length < 10) return "Telefone inválido.";
    if (!form.birthDate || form.birthDate.replace(/\D/g, '').length < 8) return "Data de nascimento obrigatória.";
    const birthDateObj = parseBRDate(form.birthDate);
    if (!birthDateObj) return "Data de nascimento inválida.";
    const age = Math.floor((Date.now() - birthDateObj.getTime()) / 31557600000);
    if (age < 18) return "Você deve ter pelo menos 18 anos.";
    if (!form.motherName.trim()) return "Nome da mãe obrigatório.";
    if (!form.ufDomicile) return "UF de domicílio obrigatória.";
    return null;
  };

  const validateStep3 = () => {
    if (!form.termsAccepted) return "Você deve aceitar os Termos de Uso.";
    if (!form.ladvSimulated) return "Simule o envio da Licença de Aprendizagem (LADV).";
    return null;
  };

  const handleNext = () => {
    setError("");
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) { setError(err); return; }
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    setError("");
    const err = validateStep3();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      setUserRole("student");
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.replace(/\D/g, ""),
        cpf: form.cpf.replace(/\D/g, ""),
        birthDate: brDateToISO(form.birthDate),
        motherName: form.motherName.trim(),
        intendedCategory: form.intendedCategory,
        ufDomicile: form.ufDomicile,
        ladvUploaded: form.ladvSimulated,
      });
      router.push("/app/student/dashboard");
    } catch (e: any) {
      const msg: string = e?.message || "Erro ao criar conta. Tente novamente.";
      if (msg.includes("CPF")) { setStep(2); }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const STEPS_LABEL = ["Acesso", "Dados Pessoais", "Documentos"];

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-8 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/20 mb-3">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cadastro de Aluno</h1>
          <p className="text-sm text-slate-500 mt-1">Conforme Resolução CONTRAN 1.020/25</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS_LABEL.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                step === i + 1
                  ? "bg-blue-600 text-white"
                  : step > i + 1
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-400"
              }`}>
                <span>{step > i + 1 ? "✓" : i + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <div className={`w-6 h-0.5 ${step > i + 1 ? "bg-green-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Dados de acesso</h2>
              <Field label="Nome completo *" hint="Informe nome e sobrenome">
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="João da Silva"
                  className={inputCls}
                />
              </Field>
              <Field label="E-mail *">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="seu@email.com"
                  className={inputCls}
                  autoComplete="email"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Senha *" hint="Mínimo 6 caracteres">
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirmar senha *">
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    autoComplete="new-password"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Dados pessoais</h2>
              <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg p-2">
                📋 Exigidos pela Res. CONTRAN 1.020/25 para habilitação de aprendizes.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Field label="CPF *">
                  <input
                    value={form.cpf}
                    onChange={(e) => set("cpf", mask(e.target.value, "###.###.###-##"))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={inputCls}
                  />
                </Field>
                <Field label="Telefone *">
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", mask(e.target.value, "(##) #####-####"))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Data de nascimento *" hint="Mínimo 18 anos">
                  <input
                    value={form.birthDate}
                    onChange={(e) => set("birthDate", maskDate(e.target.value))}
                    placeholder="DD/MM/AAAA" maxLength={10} inputMode="numeric"
                    className={inputCls}
                  />
                </Field>
                <Field label="UF de domicílio *">
                  <select value={form.ufDomicile} onChange={(e) => set("ufDomicile", e.target.value)} className={inputCls}>
                    <option value="">Selecione</option>
                    {UF_LIST.map((uf) => <option key={uf}>{uf}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Nome da mãe *" hint="Conforme documento de identidade">
                <input
                  value={form.motherName}
                  onChange={(e) => set("motherName", e.target.value)}
                  placeholder="Nome completo da mãe"
                  className={inputCls}
                />
              </Field>

              <Field label="Categoria pretendida" hint="Apenas a categoria B (Carro) está disponível no momento">
                <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3">
                  <span className="text-lg font-black text-blue-700">B</span>
                  <span className="text-sm text-blue-700 font-medium">Veículo de passeio (Carro)</span>
                </div>
              </Field>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Documentos e Termos</h2>

              {/* LADV */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📄</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Licença de Aprendizagem (LADV)</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Obrigatória pela CONTRAN 1.020/25. Documento emitido pelo DETRAN após aprovação nos exames teórico e médico/psicológico.
                    </p>
                  </div>
                </div>
                {form.ladvSimulated ? (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-bold">
                    <span>✓</span> LADV anexada com sucesso
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => set("ladvSimulated", true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition"
                  >
                    📎 Simular envio do PDF
                  </button>
                )}
              </div>

              {/* Terms */}
              <div
                role="checkbox"
                aria-checked={form.termsAccepted}
                tabIndex={0}
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => set("termsAccepted", !form.termsAccepted)}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && set("termsAccepted", !form.termsAccepted)}
              >
                <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border-2 transition-all ${
                  form.termsAccepted ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                }`}>
                  {form.termsAccepted && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Li e aceito os{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 font-bold hover:underline">Termos de Uso</a> e a{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 font-bold hover:underline">Política de Privacidade</a> do Velo,
                  incluindo o tratamento de dados biométricos e de geolocalização exigidos pela Res. CONTRAN 1.020/25.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                ⚠️ Seus dados serão tratados conforme a LGPD e utilizados exclusivamente para conformidade com a CONTRAN 1.020/25.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => { setError(""); setStep((s) => (s - 1) as Step); }}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
              >
                ← Voltar
              </button>
            )}
            <button
              type="button"
              onClick={step < 3 ? handleNext : handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition shadow-sm shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? "Criando conta..." : step < 3 ? "Próximo →" : "✓ Criar Conta"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 bg-white px-3 py-2.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}
