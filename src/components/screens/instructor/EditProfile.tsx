"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, MapPin, User, FileText, Check, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { Instructor } from '@/types';

export const InstructorEditProfile = ({ 
  profile, 
  onSave,
  onBack
}: { 
  profile: Instructor | null, 
  onSave: (profile: Instructor) => void,
  onBack: () => void
}) => {
  const [localProfile, setLocalProfile] = useState<Instructor>(profile || {
    id: '',
    email: '',
    name: '',
    profilePicture: '',
    vehicleImage: '',
    vehicleModel: '',
    rating: 0,
    reviewsCount: 0,
    pricePerClass: 0,
    location: '',
    bio: '',
    transmission: 'Manual',
    instructorType: 'Credenciado',
    vehiclePlate: '',
    vehicleYear: '',
    availability: [],
    busySlots: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile) {
      setIsLoading(true);
      try {
        await onSave(localProfile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Perfil</h1>
          <p className="text-slate-500 text-sm">Atualize suas informações públicas</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-md">
              <img src={localProfile.profilePicture || "https://ui-avatars.com/api/?name=" + localProfile.name} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button type="button" className="absolute bottom-0 right-0 bg-velo-blue text-white p-2 rounded-full shadow-lg border-2 border-white">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Nome Completo</label>
            <Input 
              value={localProfile.name}
              onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
              icon={<User size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Localização</label>
            <Input 
              value={localProfile.location}
              onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
              icon={<MapPin size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Bio / Descrição</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <FileText size={18} />
              </div>
              <textarea 
                value={localProfile.bio}
                onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-velo-blue/20 transition-all min-h-[120px] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Valor da Hora/Aula (R$)</label>
            <Input 
              type="number"
              value={localProfile.pricePerClass}
              onChange={(e) => setLocalProfile({ ...localProfile, pricePerClass: parseInt(e.target.value) || 0 })}
              icon={<span className="text-sm font-bold">R$</span>}
            />
          </div>
        </div>

        <Button className="w-full py-4 text-lg" disabled={isSaved || isLoading}>
          {isLoading ? "Salvando..." : isSaved ? <><Check size={20} /> Perfil Salvo</> : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
};
