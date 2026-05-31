"use client";

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  User,
  FileText,
  Check,
  ArrowLeft,
  Calendar,
  Hash,
  Award,
  GraduationCap,
} from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { AvatarUploader } from "@/components/ui-custom/AvatarUploader";
import { Instructor } from "@/types";
import { maskCNH, maskRENACH, maskDate } from "@/lib/utils/masks";
import { parseBRDate } from "@/lib/utils/dates";
import { format } from "date-fns";

const inputCls = "w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";
const selectCls = "w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition appearance-none text-sm text-slate-700";
const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5";

export const InstructorEditProfile = ({
  profile,
  onSave,
  onBack,
}: {
  profile: Instructor | null;
  onSave: (profile: Instructor) => void;
  onBack: () => void;
}) => {
  const [localProfile, setLocalProfile] = useState<Instructor>(
    profile || {
      id: "",
      email: "",
      name: "",
      profilePicture: "",
      vehicleImage: "",
      vehicleModel: "",
      rating: 0,
      reviewsCount: 0,
      pricePerClass: 0,
      location: "",
      bio: "",
      transmission: "Manual",
      instructorType: "Credenciado",
      vehiclePlate: "",
      vehicleYear: "",
      availability: [],
      busySlots: [],
    },
  );

  const toDisplayDate = (date?: Date | string): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? "" : format(d, "dd/MM/yyyy");
  };

  const [birthDateText, setBirthDateText] = useState(() => toDisplayDate(profile?.birthDate));

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
      setBirthDateText(toDisplayDate(profile.birthDate));
    }
  }, [profile]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile) {
      if (localProfile.birthDate) {
        const age = Math.floor((Date.now() - new Date(localProfile.birthDate).getTime()) / 31557600000);
        if (age < 21) {
          alert("O instrutor deve ter no mínimo 21 anos.");
          return;
        }
      }
      setIsLoading(true);
      setSaveError(null);
      try {
        await onSave(localProfile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error: any) {
        setSaveError(error?.message || "Erro ao salvar perfil. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-3 text-xs font-semibold"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight">Editar Perfil</h1>
          <p className="text-slate-400 text-xs mt-0.5">Informações públicas e profissionais (Res. 1.020/2025)</p>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarUploader
            currentImage={localProfile.profilePicture}
            name={localProfile.name}
            onImage={(base64) =>
              setLocalProfile({ ...localProfile, profilePicture: base64 })
            }
          />

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dados pessoais</p>

            <div className="space-y-1.5">
              <label className={labelCls}>Nome Completo</label>
              <Input
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                placeholder="Ex: João da Silva"
                icon={<User size={16} />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Data de Nascimento</label>
              <Input
                type="text"
                value={birthDateText}
                onChange={(e) => {
                  const masked = maskDate(e.target.value);
                  setBirthDateText(masked);
                  if (masked.replace(/\D/g, "").length === 8) {
                    const parsed = parseBRDate(masked);
                    if (parsed) setLocalProfile({ ...localProfile, birthDate: parsed });
                  }
                }}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                inputMode="numeric"
                icon={<Calendar size={16} />}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Localização</label>
              <Input
                value={localProfile.location}
                onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
                placeholder="Ex: Campo Grande - MS, Centro"
                icon={<MapPin size={16} />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Bio / Descrição</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                  <FileText size={16} />
                </div>
                <textarea
                  value={localProfile.bio}
                  onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  placeholder="Conte sua experiência, estilo de aula e diferenciais..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition min-h-[100px] text-sm text-slate-900 resize-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Credenciais profissionais</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelCls}>CNH</label>
                <Input
                  value={maskCNH(localProfile.cnhNumber || "")}
                  onChange={(e) => setLocalProfile({ ...localProfile, cnhNumber: maskCNH(e.target.value) })}
                  placeholder="00000000000"
                  icon={<Hash size={16} />}
                  maxLength={11}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Categoria</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Award size={16} />
                  </div>
                  <select
                    className={selectCls + " pl-10"}
                    value={localProfile.cnhCategory || "B"}
                    onChange={(e) => setLocalProfile({ ...localProfile, cnhCategory: e.target.value })}
                  >
                    {["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelCls}>Tipo de Instrutor</label>
                <select
                  className={selectCls}
                  value={localProfile.instructorType || "Credenciado"}
                  onChange={(e) => setLocalProfile({ ...localProfile, instructorType: e.target.value as any })}
                >
                  <option value="Credenciado">Credenciado (CFC)</option>
                  <option value="Autônomo">Autônomo (Res. 1.020/25)</option>
                </select>
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                    checked={localProfile.cnhEar || false}
                    onChange={(e) => setLocalProfile({ ...localProfile, cnhEar: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-700">Possui EAR</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Registro RENACH (Instrutor)</label>
              <Input
                value={maskRENACH(localProfile.renachNumber || "")}
                onChange={(e) => setLocalProfile({ ...localProfile, renachNumber: maskRENACH(e.target.value) })}
                placeholder="MS000000000"
                icon={<Hash size={16} />}
                maxLength={11}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Nº Credencial DETRAN</label>
              <Input
                value={localProfile.detranCredentialNumber || ""}
                onChange={(e) => setLocalProfile({ ...localProfile, detranCredentialNumber: e.target.value })}
                placeholder="Ex: 00012345"
                icon={<Award size={16} />}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>UF da Credencial</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <MapPin size={16} />
                </div>
                <select
                  className={selectCls + " pl-10"}
                  value={localProfile.detranCredentialUf || ""}
                  onChange={(e) => setLocalProfile({ ...localProfile, detranCredentialUf: e.target.value })}
                >
                  <option value="">Selecione a UF</option>
                  {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            {localProfile.credentialStatus && (
              <div className="space-y-1.5">
                <label className={labelCls}>Status da Credencial</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    localProfile.credentialStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    localProfile.credentialStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {localProfile.credentialStatus === 'APPROVED' ? 'Aprovada' :
                     localProfile.credentialStatus === 'REJECTED' ? 'Rejeitada' : 'Pendente'}
                  </span>
                  {localProfile.credentialValidUntil && (
                    <span className="text-xs text-slate-500">
                      válida até {format(new Date(localProfile.credentialValidUntil), 'dd/MM/yyyy')}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className={labelCls}>Escolaridade</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <GraduationCap size={16} />
                </div>
                <select
                  className={selectCls + " pl-10"}
                  value={localProfile.educationLevel || "Ensino Médio"}
                  onChange={(e) => setLocalProfile({ ...localProfile, educationLevel: e.target.value })}
                >
                  <option value="Ensino Médio">Ensino Médio Completo</option>
                  <option value="Superior Incompleto">Superior Incompleto</option>
                  <option value="Superior Completo">Superior Completo</option>
                  <option value="Pós-Graduação">Pós-Graduação</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Valor da Hora/Aula (R$)</label>
              <Input
                type="number"
                value={localProfile.pricePerClass || ""}
                onChange={(e) =>
                  setLocalProfile({
                    ...localProfile,
                    pricePerClass: e.target.value === "" ? 0 : parseInt(e.target.value),
                  })
                }
                placeholder="80"
                icon={<span className="text-xs font-bold">R$</span>}
                required
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Declarações obrigatórias</p>
            {[
              { field: 'noGravissima' as const, text: 'Não cometi nenhuma infração de trânsito gravíssima nos últimos 60 dias.' },
              { field: 'hasInstructorCourse' as const, text: 'Possuo certificado de curso específico realizado pelo órgão executivo de trânsito.' },
              { field: 'noCassacao' as const, text: 'Não sofri penalidade de cassação da CNH.' },
              { field: 'certidaoNegativa' as const, text: 'Declaro possuir as certidões negativas criminais e de débitos exigidas para o exercício da atividade.' },
            ].map(({ field, text }) => (
              <label key={field} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-600"
                  checked={typeof localProfile[field] === 'string' ? !!localProfile[field] : localProfile[field] as boolean || false}
                  onChange={(e) => setLocalProfile({ ...localProfile, [field]: e.target.checked })}
                />
                <span className="text-xs text-slate-600 leading-tight">{text}</span>
              </label>
            ))}
          </div>

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaved || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Salvando..." : isSaved ? <><Check size={18} /> Perfil Salvo</> : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};
