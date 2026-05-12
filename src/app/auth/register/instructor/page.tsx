"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { maskCNH, maskRENACH, maskPlate } from "@/lib/utils/masks";

const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const CNH_CATS = ["A","B","C","D","E","AB","AC","AD","AE"];
const EDU_LEVELS = ["Fundamental Incompleto","Fundamental Completo","Médio Incompleto","Médio Completo","Superior Incompleto","Superior Completo","Pós-Graduação"];

interface FormData {
  // Step 1 — Acesso
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 — Dados pessoais (CONTRAN 1.020/25 Art. 4º)
  cpf: string;
  phone: string;
  birthDate: string;
  educationLevel: string;
  location: string;
  bio: string;
  pricePerClass: string;
  // Step 3 — Habilitação e Credencial DETRAN (CONTRAN 1.020/25 Art. 5º)
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
  cnhEar: boolean;    // Exercício de Atividade Remunerada
  renachNumber: string;
  instructorType: "Credenciado" | "Autônomo" | "";
  certidaoNegativa: string; // número/protocolo
  // Step 4 — Veículo e Termos
  vehiclePlate: string;
  vehicleModel: string;
  vehicleYear: string;
  transmission: "Manual" | "Automatic" | "";
  hasDoubleCommand: boolean;
  termsAccepted: boolean;
}

const INITIAL: FormData = {
  name: "", email: "", password: "", confirmPassword: "",
  cpf: "", phone: "", birthDate: "", educationLevel: "", location: "", bio: "", pricePerClass: "",
  cnhNumber: "", cnhCategory: "", cnhExpiry: "", cnhEar: true, renachNumber: "", instructorType: "", certidaoNegativa: "",
  vehiclePlate: "", vehicleModel: "", vehicleYear: "", transmission: "",
  hasDoubleCommand: false,
  termsAccepted: false,
};

function mask(value: string, pattern: string) {
  let i = 0;
  const v = value.replace(/\D/g, "");
  return pattern.replace(/#/g, () => v[i++] || "").replace(/[#-]+$/, "");
}

export default function InstructorRegisterPage() {
  const router = useRouter();
  const { register, setUserRole } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const validateStep1 = () => {
    if (!form.name.trim() || form.name.trim().split(" ").length < 2) return "Informe nome e sobrenome.";
    if (!form.email.includes("@")) return "E-mail inválido.";
    if (form.password.length < 6) return "Senha deve ter mínimo 6 caracteres.";
    if (form.password !== form.confirmPassword) return "As senhas não coincidem.";
    return null;
  };

  const validateStep2 = () => {
    if (form.cpf.replace(/\D/g, "").length !== 11) return "CPF deve ter 11 dígitos.";
    if (form.phone.replace(/\D/g, "").length < 10) return "Telefone inválido.";
    if (!form.birthDate) return "Data de nascimento obrigatória.";
    const age = Math.floor((Date.now() - new Date(form.birthDate).getTime()) / 31557600000);
    if (age < 25) return "Instrutor deve ter no mínimo 25 anos (CONTRAN 1.020/25).";
    if (!form.educationLevel) return "Nível de escolaridade obrigatório.";
    if (!form.location.trim()) return "Localização obrigatória.";
    if (!form.pricePerClass || Number(form.pricePerClass) <= 0) return "Informe o valor por aula.";
    return null;
  };

  const validateStep3 = () => {
    if (form.cnhNumber.replace(/\D/g, "").length !== 11) return "Número da CNH deve ter 11 dígitos.";
    if (!form.cnhCategory) return "Selecione a categoria da CNH.";
    if (!form.cnhExpiry) return "Data de validade da CNH obrigatória.";
    const expiry = new Date(form.cnhExpiry);
    if (expiry < new Date()) return "CNH está vencida. Renove antes de se cadastrar.";
    if (!form.renachNumber.trim()) return "Número RENACH obrigatório.";
    if (!form.instructorType) return "Selecione o tipo de instrutor.";
    if (!form.certidaoNegativa.trim()) return "Nº da Certidão Negativa obrigatório.";
    return null;
  };

  const validateStep4 = () => {
    const plate = form.vehiclePlate.replace(/[^a-zA-Z0-9]/g, "");
    if (plate.length < 7) return "Placa do veículo inválida.";
    if (!form.vehicleModel.trim()) return "Modelo do veículo obrigatório.";
    if (!form.vehicleYear || Number(form.vehicleYear) < 2000) return "Ano do veículo deve ser a partir de 2000.";
    if (!form.transmission) return "Selecione o tipo de câmbio.";
    if (!form.termsAccepted) return "Você deve aceitar os Termos de Uso.";
    return null;
  };

  const handleNext = () => {
    setError("");
    const validators = [validateStep1, validateStep2, validateStep3, validateStep4];
    const err = validators[step - 1]?.();
    if (err) { setError(err); return; }
    if (step < 4) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setError("");
    const err = validateStep4();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      setUserRole("instructor");
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.replace(/\D/g, ""),
        cpf: form.cpf.replace(/\D/g, ""),
        birthDate: form.birthDate,
        educationLevel: form.educationLevel,
        instructorType: form.instructorType,
        location: form.location.trim(),
        bio: form.bio.trim(),
        pricePerClass: Number(form.pricePerClass),
        cnhNumber: form.cnhNumber.replace(/\D/g, ""),
        cnhCategory: form.cnhCategory,
        cnhExpiry: form.cnhExpiry,
        cnhEar: form.cnhEar,
        renachNumber: form.renachNumber.trim(),
        certidaoNegativa: form.certidaoNegativa.trim(),
        vehiclePlate: form.vehiclePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
        vehicleModel: form.vehicleModel.trim(),
        vehicleYear: Number(form.vehicleYear),
        transmission: form.transmission,
        hasDoubleCommand: form.hasDoubleCommand,
      });
      router.push("/app/instructor/dashboard");
    } catch (e: any) {
      setError(e?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Acesso", "Perfil", "Habilitação", "Veículo"];

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-8 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow mb-3">
            <span className="text-2xl font-black italic text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cadastro de Instrutor</h1>
          <p className="text-sm text-slate-500 mt-1">Conforme Resolução CONTRAN 1.020/25 — Arts. 4º e 5º</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                step === i + 1 ? "bg-blue-600 text-white"
                : step > i + 1 ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-400"
              }`}>
                <span>{step > i + 1 ? "✓" : i + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 3 && <div className={`w-4 h-0.5 ${step > i + 1 ? "bg-green-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>
          )}

          {/* STEP 1 — Acesso */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Dados de acesso</h2>
              <Field label="Nome completo *" hint="Informe nome e sobrenome">
                <input value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="João da Silva" className={inputCls} />
              </Field>
              <Field label="E-mail *">
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="seu@email.com" className={inputCls} autoComplete="email" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Senha *" hint="Mínimo 6 caracteres">
                  <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="••••••••" className={inputCls} autoComplete="new-password" />
                </Field>
                <Field label="Confirmar senha *">
                  <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="••••••••" className={inputCls} autoComplete="new-password" />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — Perfil */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Dados pessoais e profissionais</h2>
              <div className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg p-2">
                📋 CONTRAN 1.020/25, Art. 4º: instrutor deve ter ≥25 anos e ≥3 anos de habilitação.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="CPF *">
                  <input value={form.cpf}
                    onChange={(e) => set("cpf", mask(e.target.value, "###.###.###-##"))}
                    placeholder="000.000.000-00" maxLength={14} className={inputCls} />
                </Field>
                <Field label="Telefone *">
                  <input value={form.phone}
                    onChange={(e) => set("phone", mask(e.target.value, "(##) #####-####"))}
                    placeholder="(11) 99999-9999" maxLength={15} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Data de nascimento *" hint="Mínimo 25 anos">
                  <input type="date" value={form.birthDate}
                    onChange={(e) => set("birthDate", e.target.value)}
                    max={new Date(Date.now() - 25 * 31557600000).toISOString().split("T")[0]}
                    className={inputCls} />
                </Field>
                <Field label="Escolaridade *">
                  <select value={form.educationLevel} onChange={(e) => set("educationLevel", e.target.value)} className={inputCls}>
                    <option value="">Selecione</option>
                    {EDU_LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Cidade / Bairro de atuação *">
                <input value={form.location} onChange={(e) => set("location", e.target.value)}
                  placeholder="Ex: São Paulo - SP, Vila Madalena" className={inputCls} />
              </Field>

              <Field label="Valor por aula (R$) *">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">R$</span>
                  <input type="number" min={0} value={form.pricePerClass}
                    onChange={(e) => set("pricePerClass", e.target.value)}
                    placeholder="80,00" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <Field label="Apresentação profissional">
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)}
                  rows={3} placeholder="Descreva sua experiência, especialidades e abordagem pedagógica..."
                  className={`${inputCls} resize-none`} />
              </Field>
            </div>
          )}

          {/* STEP 3 — Habilitação */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Habilitação e Credencial DETRAN</h2>
              <div className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg p-2">
                ⚠️ CONTRAN 1.020/25, Art. 5º: documentos obrigatórios para exercício da atividade de instrutor autônomo.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nº CNH *" hint="11 dígitos">
                  <input value={form.cnhNumber}
                    onChange={(e) => set("cnhNumber", maskCNH(e.target.value))}
                    placeholder="00000000000" maxLength={11} inputMode="numeric" className={inputCls} />
                </Field>
                <Field label="Categoria CNH *">
                  <select value={form.cnhCategory} onChange={(e) => set("cnhCategory", e.target.value)} className={inputCls}>
                    <option value="">Selecione</option>
                    {CNH_CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Validade da CNH *">
                  <input type="date" value={form.cnhExpiry}
                    onChange={(e) => set("cnhExpiry", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputCls} />
                </Field>
                <Field label="Nº RENACH *" hint="11 dígitos do Registro Nacional CNH">
                  <input value={form.renachNumber}
                    onChange={(e) => set("renachNumber", maskRENACH(e.target.value))}
                    placeholder="00000000000" maxLength={11} inputMode="numeric" className={inputCls} />
                </Field>
              </div>

              {/* EAR */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-700">EAR — Exercício de Atividade Remunerada *</p>
                <p className="text-xs text-slate-500">CNH com autorização para exercer atividade remunerada de instrutor (exigida pelo CONTRAN).</p>
                <div className="flex gap-3">
                  {[true, false].map((v) => (
                    <button key={String(v)} type="button" onClick={() => set("cnhEar", v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                        form.cnhEar === v ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}>
                      {v ? "✓ Possuo EAR" : "✗ Não possuo"}
                    </button>
                  ))}
                </div>
                {!form.cnhEar && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                    ⚠️ Sem EAR, você não poderá iniciar aulas. Regularize sua CNH antes de prosseguir.
                  </p>
                )}
              </div>

              <Field label="Tipo de instrutor *">
                <div className="grid grid-cols-2 gap-3">
                  {(["Credenciado", "Autônomo"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => set("instructorType", t)}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        form.instructorType === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}>
                      {t === "Credenciado" ? "🏫 Credenciado (CFC)" : "🚗 Autônomo"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Certidão Negativa de Antecedentes *" hint="Nº do documento ou protocolo de emissão">
                <input value={form.certidaoNegativa} onChange={(e) => set("certidaoNegativa", e.target.value)}
                  placeholder="Nº ou protocolo da Certidão Negativa" className={inputCls} />
              </Field>
            </div>
          )}

          {/* STEP 4 — Veículo e Termos */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Veículo de instrução</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Placa *">
                  <input value={form.vehiclePlate}
                    onChange={(e) => set("vehiclePlate", maskPlate(e.target.value))}
                    placeholder="ABC-1234 ou ABC1D23" maxLength={8} className={inputCls} />
                </Field>
                <Field label="Ano *">
                  <input type="number" value={form.vehicleYear}
                    onChange={(e) => set("vehicleYear", e.target.value)}
                    placeholder="2018" min={2000} max={new Date().getFullYear() + 1}
                    className={inputCls} />
                </Field>
              </div>

              <Field label="Modelo *">
                <input value={form.vehicleModel} onChange={(e) => set("vehicleModel", e.target.value)}
                  placeholder="Ex: Volkswagen Polo 1.0" className={inputCls} />
              </Field>

              <Field label="Tipo de câmbio *">
                <div className="grid grid-cols-2 gap-3">
                  {(["Manual", "Automatic"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => set("transmission", t)}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        form.transmission === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}>
                      {t === "Manual" ? "⚙️ Manual" : "🤖 Automático"}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recursos de Instrução</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={form.hasDoubleCommand}
                      onChange={(e) => set("hasDoubleCommand", e.target.checked)} className="sr-only" />
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                      form.hasDoubleCommand ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                    }`}>
                      {form.hasDoubleCommand && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    Veículo possui <strong>duplo comando</strong> (opcional p/ autônomos conforme Res. 1.020/25)
                  </span>
                </label>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mt-2">
                <div className="relative mt-0.5">
                  <input type="checkbox" checked={form.termsAccepted}
                    onChange={(e) => set("termsAccepted", e.target.checked)} className="sr-only" />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                    form.termsAccepted ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                  }`}>
                    {form.termsAccepted && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Declaro que as informações são verdadeiras e aceito os{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Termos de Uso</a>,{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Política de Privacidade</a> e as obrigações
                  previstas na <span className="font-bold">Resolução CONTRAN 1.020/25</span>, incluindo coleta de
                  dados biométricos e de geolocalização durante as aulas.
                </p>
              </label>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                ⚠️ Declarações falsas implicam cancelamento imediato do cadastro e podem acarretar responsabilidade civil e criminal.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button"
                onClick={() => { setError(""); setStep((s) => s - 1); }}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                ← Voltar
              </button>
            )}
            <button type="button"
              onClick={step < 4 ? handleNext : handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
              {loading ? "Criando conta..." : step < 4 ? "Próximo →" : "✓ Criar Conta"}
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
  "w-full border border-slate-200 bg-slate-50 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}
