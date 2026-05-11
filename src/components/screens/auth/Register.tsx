"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, User, Mail, MessageCircle, CheckCircle2, Car,
  Lock, Loader2, CreditCard, Eye, EyeOff, Calendar,
  MapPin, GraduationCap, Award, Hash, Heart,
} from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { maskCPF, maskPhone, maskCNH, maskRENACH } from "@/lib/utils/masks";

export const Register = ({
  role,
  onRegister,
  onBack,
}: {
  role: UserRole;
  onRegister: (data: any) => Promise<void>;
  onBack: () => void;
}) => {
  const isStudent = role === "student";
  const [instructorType, setInstructorType] = useState<"Credenciado" | "Autônomo">("Credenciado");
  const [ladvFile, setLadvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", cpf: "", birthDate: "",
    motherName: "", intendedCategory: "B", ufDomicile: "SP",
    password: "", confirmPassword: "", vehicleModel: "",
    credencial: "", cnhNumber: "", cnhCategory: "B", cnhExpiry: "",
    cnhEar: false, certidaoNegativa: "", educationLevel: "Ensino Médio",
    renachNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: string, value: any) => setFormData((p) => ({ ...p, [field]: value }));

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) { setError("As senhas não coincidem"); return; }
    if (formData.password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres"); return; }

    try {
      setLoading(true);
      setError(null);
      await onRegister({
        name: formData.name, email: formData.email,
        phone: formData.phone.replace(/\D/g, ""),
        cpf: formData.cpf.replace(/\D/g, ""),
        birthDate: formData.birthDate, password: formData.password,
        ladvUploaded: !!ladvFile,
        ...(role === "student" && {
          motherName: formData.motherName,
          intendedCategory: formData.intendedCategory,
          ufDomicile: formData.ufDomicile,
        }),
        ...(role !== "student" && {
          instructorType, vehicleModel: formData.vehicleModel,
          credencial: formData.credencial, cnhNumber: formData.cnhNumber,
          cnhCategory: formData.cnhCategory, cnhExpiry: formData.cnhExpiry,
          cnhEar: formData.cnhEar, certidaoNegativa: formData.certidaoNegativa,
          educationLevel: formData.educationLevel, renachNumber: formData.renachNumber,
        }),
      });
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">{children}</h2>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex md:h-screen md:overflow-hidden"
    >
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden md:flex md:w-[38%] lg:w-[42%] bg-velo-blue flex-col justify-between p-12 text-white shrink-0 md:h-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Car size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-snug">
            {isStudent ? 'Comece sua\njornada hoje.' : 'Expanda\nsua carreira.'}
          </h2>
          <p className="text-blue-200 text-base leading-relaxed">
            {isStudent
              ? 'Preencha seus dados e encontre o instrutor certo para você em minutos.'
              : 'Cadastre-se e comece a receber alunos amanhã mesmo.'}
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="text-blue-300 text-sm">
              {isStudent
                ? 'Já possui conta? '
                : 'Já possui conta? '}
              <button onClick={onBack} className="text-white font-bold hover:underline underline-offset-2">
                Fazer login
              </button>
            </p>
          </div>
        </div>

        <p className="text-blue-400 text-xs">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* ── Right form panel (scrollable) ── */}
      <div className="flex-1 bg-white flex flex-col overflow-y-auto md:h-full">
        <div className="p-6 md:p-10 lg:p-14 flex flex-col min-h-full">

          <button
            onClick={onBack}
            className="self-start flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-8 -ml-1"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          <div className="w-full max-w-2xl">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-8 h-8 bg-velo-blue rounded-xl flex items-center justify-center">
                <Car size={16} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">VELO</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Criar conta {isStudent ? 'Aluno' : 'Instrutor'}
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm">Preencha seus dados para começar.</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="rotate-180 shrink-0" size={16} />
                {error}
              </div>
            )}

            <form
              className="space-y-6"
              onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
            >
              {/* Dados Pessoais */}
              <div className="space-y-3">
                <SectionTitle>Dados Pessoais</SectionTitle>
                <Input
                  type="text" placeholder="Nome completo" icon={<User size={18} />}
                  value={formData.name} onChange={(e) => set("name", e.target.value)}
                  autoComplete="name" required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type="date" placeholder="Data de Nascimento" icon={<Calendar size={18} />}
                    value={formData.birthDate} onChange={(e) => set("birthDate", e.target.value)} required
                  />
                  <Input
                    type="text" placeholder="CPF" icon={<CreditCard size={18} />}
                    value={maskCPF(formData.cpf)}
                    onChange={(e) => set("cpf", maskCPF(e.target.value))}
                    maxLength={14} required
                  />
                </div>
                {isStudent && (
                  <Input
                    type="text" placeholder="Nome da Mãe" icon={<Heart size={18} />}
                    value={formData.motherName} onChange={(e) => set("motherName", e.target.value)} required
                  />
                )}
              </div>

              {/* Contato */}
              <div className="space-y-3">
                <SectionTitle>Contato</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type="email" placeholder="Seu e-mail" icon={<Mail size={18} />}
                    value={formData.email} onChange={(e) => set("email", e.target.value)}
                    autoComplete="email" required
                  />
                  <Input
                    type="tel" placeholder="Celular (WhatsApp)" icon={<MessageCircle size={18} />}
                    value={maskPhone(formData.phone)}
                    onChange={(e) => set("phone", maskPhone(e.target.value))}
                    autoComplete="tel" maxLength={15} required
                  />
                </div>
              </div>

              {/* Student-specific */}
              {isStudent ? (
                <div className="space-y-3">
                  <SectionTitle>Processo RENACH</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Award size={18} />
                      </div>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-slate-700 text-sm"
                        value={formData.intendedCategory}
                        onChange={(e) => set("intendedCategory", e.target.value)}
                      >
                        <option value="A">Cat. A (Moto)</option>
                        <option value="B">Cat. B (Carro)</option>
                        <option value="ACC">ACC</option>
                        <option value="AB">Cat. AB (Ambos)</option>
                      </select>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <MapPin size={18} />
                      </div>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-slate-700 text-sm"
                        value={formData.ufDomicile}
                        onChange={(e) => set("ufDomicile", e.target.value)}
                      >
                        {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* LADV upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      LADV <span className="text-slate-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                      <input
                        type="file" accept=".pdf,.jpg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setLadvFile(e.target.files?.[0] || null)}
                      />
                      {ladvFile ? (
                        <div className="flex items-center justify-center gap-2 text-velo-green">
                          <CheckCircle2 size={20} />
                          <span className="text-sm font-medium text-slate-900">{ladvFile.name}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Clique para enviar foto ou PDF</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Necessário apenas para agendar aulas.</p>
                  </div>
                </div>
              ) : (
                /* Instructor-specific */
                <div className="space-y-3">
                  <SectionTitle>Habilitação & Profissional</SectionTitle>

                  {/* Type toggle */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    {(["Credenciado", "Autônomo"] as const).map((t) => (
                      <button
                        key={t} type="button" onClick={() => setInstructorType(t)}
                        aria-pressed={instructorType === t}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-sm font-semibold transition-colors",
                          instructorType === t ? "bg-white text-velo-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {t === "Credenciado" ? "CFC (Credenciado)" : "Autônomo"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="text" placeholder="Número CNH" icon={<Hash size={18} />}
                      value={maskCNH(formData.cnhNumber)}
                      onChange={(e) => set("cnhNumber", maskCNH(e.target.value))}
                      maxLength={11} required
                    />
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Award size={18} />
                      </div>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-slate-700 text-sm"
                        value={formData.cnhCategory}
                        onChange={(e) => set("cnhCategory", e.target.value)}
                      >
                        {["A","B","C","D","E","AB","AC","AD","AE"].map((cat) => (
                          <option key={cat} value={cat}>Cat. {cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date" placeholder="Validade CNH" icon={<Calendar size={18} />}
                      value={formData.cnhExpiry} onChange={(e) => set("cnhExpiry", e.target.value)} required
                    />
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none"
                      onClick={() => set("cnhEar", !formData.cnhEar)}
                    >
                      <input
                        type="checkbox" checked={formData.cnhEar}
                        onChange={(e) => set("cnhEar", e.target.checked)}
                        className="w-4 h-4 text-velo-blue rounded focus-visible:ring-velo-blue"
                      />
                      <span className="text-sm font-medium text-slate-700">Possui EAR?</span>
                    </div>
                  </div>

                  <Input
                    type="text" placeholder="Registro RENACH de Instrutor" icon={<Hash size={18} />}
                    value={maskRENACH(formData.renachNumber)}
                    onChange={(e) => set("renachNumber", maskRENACH(e.target.value))}
                    maxLength={11} required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="text" placeholder="URL Certidão Negativa" icon={<CheckCircle2 size={18} />}
                      value={formData.certidaoNegativa}
                      onChange={(e) => set("certidaoNegativa", e.target.value)} required
                    />
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <GraduationCap size={18} />
                      </div>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-slate-700 text-sm"
                        value={formData.educationLevel}
                        onChange={(e) => set("educationLevel", e.target.value)}
                      >
                        <option value="Ensino Médio">Ensino Médio Completo</option>
                        <option value="Superior Incompleto">Superior Incompleto</option>
                        <option value="Superior Completo">Superior Completo</option>
                        <option value="Pós-Graduação">Pós-Graduação</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    type="text" placeholder="Modelo do Veículo" icon={<Car size={18} />}
                    value={formData.vehicleModel}
                    onChange={(e) => set("vehicleModel", e.target.value)} required
                  />

                  {instructorType === "Credenciado" && (
                    <Input
                      type="text" placeholder="Número da Credencial (CFC)" icon={<CheckCircle2 size={18} />}
                      value={formData.credencial}
                      onChange={(e) => set("credencial", e.target.value)} required
                    />
                  )}
                </div>
              )}

              {/* Segurança */}
              <div className="space-y-3">
                <SectionTitle>Segurança</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha"
                    icon={<Lock size={18} />}
                    rightIcon={
                      <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-velo-blue transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    value={formData.password}
                    onChange={(e) => set("password", e.target.value)}
                    autoComplete="new-password" minLength={6} required
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme a senha"
                    icon={<Lock size={18} />}
                    value={formData.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    autoComplete="new-password" required
                  />
                </div>
              </div>

              <Button className="w-full py-3 mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={18} />
                    Cadastrando...
                  </span>
                ) : "Criar conta"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-slate-500 md:hidden text-center">
              Já tem uma conta?{" "}
              <button onClick={onBack} className="text-velo-blue font-bold hover:underline underline-offset-2">
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
