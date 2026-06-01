"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { maskCNH, maskRENACH, maskPlate, maskDate, maskPattern, maskCurrency, parseCurrency } from "@/lib/utils/masks";
import { parseBRDate, brDateToISO } from "@/lib/utils/dates";

const CNH_CATS = ["A", "B", "AB"];
const EDU_LEVELS = ["Médio Completo", "Superior Incompleto", "Superior Completo", "Pós-Graduação"];

interface FormData {
  // Step 1 — Acesso
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 — Dados pessoais
  cpf: string;
  phone: string;
  birthDate: string;
  educationLevel: string;
  location: string;
  bio: string;
  pricePerClass: string;
  // Step 3 — Habilitação e Credencial
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
  cnhEar: boolean;    // Exercício de Atividade Remunerada
  renachNumber: string;
  instructorType: "Credenciado" | "Autônomo" | "";
  certidaoNegativa: string; // número/protocolo
  // Novos requisitos
  noGravissima: boolean;
  hasInstructorCourse: boolean;
  noCassacao: boolean;
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
  noGravissima: false, hasInstructorCourse: false, noCassacao: false,
  vehiclePlate: "", vehicleModel: "", vehicleYear: "", transmission: "",
  hasDoubleCommand: false,
  termsAccepted: false,
};

export default function InstructorRegisterPage() {
  const router = useRouter();
  const { register, setUserRole } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!form.birthDate || form.birthDate.replace(/\D/g, '').length < 8) return "Data de nascimento obrigatória.";
    const birthDateObj = parseBRDate(form.birthDate);
    if (!birthDateObj) return "Data de nascimento inválida.";
    const age = Math.floor((Date.now() - birthDateObj.getTime()) / 31557600000);
    if (age < 21) return "Instrutor deve ter no mínimo 21 anos.";
    if (!form.educationLevel) return "Nível de escolaridade obrigatório.";
    const validEdu = ["Médio Completo", "Superior Incompleto", "Superior Completo", "Pós-Graduação"];
    if (!validEdu.includes(form.educationLevel)) return "É necessário ter concluído ao menos o Ensino Médio.";
    if (!form.location.trim()) return "Localização obrigatória.";
    if (!form.pricePerClass || parseCurrency(form.pricePerClass) <= 0) return "Informe o valor por aula.";
    return null;
  };

  const validateStep3 = () => {
    if (form.cnhNumber.replace(/\D/g, "").length !== 11) return "Número da CNH deve ter 11 dígitos.";
    if (!form.cnhCategory) return "Selecione a categoria da CNH.";
    if (!form.cnhExpiry || form.cnhExpiry.replace(/\D/g, '').length < 8) return "Data de validade da CNH obrigatória.";
    const expiryObj = parseBRDate(form.cnhExpiry);
    if (!expiryObj) return "Data de validade da CNH inválida.";
    if (expiryObj < new Date()) return "CNH está vencida. Renove antes de se cadastrar.";
    if (!form.renachNumber.trim()) return "Número RENACH obrigatório.";
    if (!form.instructorType) return "Selecione o tipo de instrutor.";
    if (!form.certidaoNegativa.trim()) return "Nº da Certidão Negativa obrigatório.";

    if (!form.noGravissima) return "Você declara não ter infração gravíssima nos últimos 60 dias?";
    if (!form.hasInstructorCourse) return "É obrigatório possuir certificado de curso específico.";
    if (!form.noCassacao) return "Você declara não ter sofrido penalidade de cassação da CNH?";

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
        birthDate: brDateToISO(form.birthDate),
        educationLevel: form.educationLevel,
        instructorType: form.instructorType,
        location: form.location.trim(),
        bio: form.bio.trim(),
        pricePerClass: parseCurrency(form.pricePerClass),
        cnhNumber: form.cnhNumber.replace(/\D/g, ""),
        cnhCategory: form.cnhCategory,
        cnhExpiry: brDateToISO(form.cnhExpiry),
        cnhEar: form.cnhEar,
        renachNumber: form.renachNumber.trim(),
        certidaoNegativa: form.certidaoNegativa.trim(),
        noGravissima: form.noGravissima,
        hasInstructorCourse: form.hasInstructorCourse,
        noCassacao: form.noCassacao,
        vehiclePlate: form.vehiclePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
        vehicleModel: form.vehicleModel.trim(),
        vehicleYear: Number(form.vehicleYear),
        transmission: form.transmission,
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
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/20 mb-3">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cadastro de Instrutor</h1>
          <p className="text-sm text-slate-500 mt-1">Conforme Resolução CONTRAN 1.020/25 — Arts. 4º e 5º</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${step === i + 1 ? "bg-blue-600 text-white"
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
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="••••••••" className={`${inputCls} pr-10`} autoComplete="new-password" />
                    <button type="button" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirmar senha *">
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="••••••••" className={`${inputCls} pr-10`} autoComplete="new-password" />
                    <button type="button" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                      aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — Perfil */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Dados pessoais e profissionais</h2>
              <div className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
                <p className="font-bold mb-1 uppercase tracking-wider text-[10px] text-blue-700">Requisitos para ser instrutor:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Ter no mínimo 21 anos de idade</li>
                  <li>Ter habilitação legal há pelo menos 2 anos</li>
                  <li>Ter concluído o ensino médio</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="CPF *">
                  <input value={form.cpf}
                    onChange={(e) => set("cpf", maskPattern(e.target.value, "###.###.###-##"))}
                    placeholder="000.000.000-00" maxLength={14} className={inputCls} />
                </Field>
                <Field label="Telefone *">
                  <input value={form.phone}
                    onChange={(e) => set("phone", maskPattern(e.target.value, "(##) #####-####"))}
                    placeholder="(11) 99999-9999" maxLength={15} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Data de nascimento *" hint="Mínimo 21 anos">
                  <input value={form.birthDate}
                    onChange={(e) => set("birthDate", maskDate(e.target.value))}
                    placeholder="DD/MM/AAAA" maxLength={10} inputMode="numeric"
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
                  <input type="text" inputMode="numeric" value={form.pricePerClass}
                    onChange={(e) => set("pricePerClass", maskCurrency(e.target.value))}
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
              <h2 className="text-base font-bold text-slate-800">Habilitação e Credencial</h2>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Declarações Obrigatórias</p>

                <CheckDeclaration
                  checked={form.noGravissima}
                  onChange={(v) => set("noGravissima", v)}
                  label="Não cometi infração gravíssima nos últimos 60 dias *"
                />
                <CheckDeclaration
                  checked={form.hasInstructorCourse}
                  onChange={(v) => set("hasInstructorCourse", v)}
                  label="Possuo certificado de curso específico pelo DETRAN *"
                />
                <CheckDeclaration
                  checked={form.noCassacao}
                  onChange={(v) => set("noCassacao", v)}
                  label="Não sofri penalidade de cassação da CNH *"
                />
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
                  <input value={form.cnhExpiry}
                    onChange={(e) => set("cnhExpiry", maskDate(e.target.value))}
                    placeholder="DD/MM/AAAA" maxLength={10} inputMode="numeric"
                    className={inputCls} />
                </Field>
                <Field label="Nº RENACH *" hint="UF + 9 dígitos — ex: MS123456789">
                  <input value={form.renachNumber}
                    onChange={(e) => set("renachNumber", maskRENACH(e.target.value))}
                    placeholder="MS000000000" maxLength={11} className={inputCls} />
                </Field>
              </div>

              {/* EAR */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-700">EAR — Exercício de Atividade Remunerada *</p>
                <p className="text-xs text-slate-500">CNH com autorização para exercer atividade remunerada de instrutor (exigida pelo CONTRAN).</p>
                <div className="flex gap-3">
                  {[true, false].map((v) => (
                    <button key={String(v)} type="button" onClick={() => set("cnhEar", v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${form.cnhEar === v ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
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
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${form.instructorType === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                        }`}>
                      {t === "Credenciado" ? "🏫 Credenciado (CFC)" : "🚗 Autônomo"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Certidão Negativa de Antecedentes *" hint="Protocolo emitido pela Polícia Federal (policiafederal.gov.br)">
                <input value={form.certidaoNegativa}
                  onChange={(e) => set("certidaoNegativa", maskPattern(e.target.value, "########/####"))}
                  placeholder="00000000/2024" maxLength={13} inputMode="numeric"
                  className={inputCls} />
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
                  <input value={form.vehicleYear}
                    onChange={(e) => set("vehicleYear", e.target.value.replace(/\D/g, "").substring(0, 4))}
                    placeholder="2018" inputMode="numeric" maxLength={4}
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
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${form.transmission === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                        }`}>
                      {t === "Manual" ? "⚙️ Manual" : "🤖 Automático"}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Terms */}
              <div
                role="checkbox"
                aria-checked={form.termsAccepted}
                tabIndex={0}
                className="flex items-start gap-3 cursor-pointer mt-2"
                onClick={() => set("termsAccepted", !form.termsAccepted)}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && set("termsAccepted", !form.termsAccepted)}
              >
                <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border-2 transition-all ${form.termsAccepted ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                  }`}>
                  {form.termsAccepted && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Declaro que as informações são verdadeiras e aceito os{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 font-bold hover:underline">Termos de Uso</a>,{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 font-bold hover:underline">Política de Privacidade</a> e as obrigações
                  previstas na <span className="font-bold">Resolução CONTRAN 1.020/25</span>, incluindo coleta de
                  dados biométricos e de geolocalização durante as aulas.
                </p>
              </div>

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
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition shadow-sm shadow-blue-600/20 disabled:opacity-50">
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

function CheckDeclaration({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className="flex items-start gap-3 cursor-pointer"
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange(!checked)}
    >
      <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border-2 transition-all ${checked ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
        }`}>
        {checked && <span className="text-white text-xs font-bold">✓</span>}
      </div>
      <span className="text-xs text-slate-600 leading-tight">{label}</span>
    </div>
  );
}
