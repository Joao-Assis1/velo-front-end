"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car, Camera, Check, Settings, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { Instructor } from '@/types';
import { cn } from '@/lib/utils';

export const InstructorVehicle = ({ 
  profile, 
  onSave,
  onBack
}: { 
  profile: Instructor, 
  onSave: (profile: Instructor) => void,
  onBack: () => void
}) => {
  const [localProfile, setLocalProfile] = useState<Instructor>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meu Veículo</h1>
          <p className="text-slate-500 text-sm">Gerencie o veículo utilizado nas aulas</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-slate-100">
            <img src={localProfile.vehicleImage} alt="Vehicle" className="w-full h-full object-cover" />
            <button type="button" className="absolute bottom-4 right-4 bg-velo-blue text-white p-3 rounded-full shadow-lg border-2 border-white">
              <Camera size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Modelo do Veículo</label>
            <Input 
              value={localProfile.vehicleModel}
              onChange={(e) => setLocalProfile({ ...localProfile, vehicleModel: e.target.value })}
              icon={<Car size={18} />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Placa</label>
              <Input 
                value={localProfile.vehiclePlate || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, vehiclePlate: e.target.value.toUpperCase() })}
                placeholder="ABC-1234"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Ano</label>
              <Input 
                value={localProfile.vehicleYear || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, vehicleYear: e.target.value })}
                placeholder="2023"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Câmbio</label>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
               {['Manual', 'Automatic'].map((t) => (
                 <button
                   key={t}
                   type="button"
                   onClick={() => setLocalProfile({ ...localProfile, transmission: t as any })}
                   className={cn(
                     "flex-1 py-3 rounded-lg text-sm font-bold transition-all",
                     localProfile.transmission === t 
                      ? "bg-white text-velo-blue shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                   )}
                 >
                   {t === 'Manual' ? 'Manual' : 'Automático'}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl flex gap-4 items-start border border-blue-100">
           <div className="bg-white p-2 rounded-full text-velo-blue shadow-sm shrink-0">
             <Settings size={20} />
           </div>
           <p className="text-xs text-slate-600 leading-relaxed">
             Mantenha os dados do veículo sempre atualizados para que os alunos possam identificá-lo facilmente no momento da aula.
           </p>
        </div>

        <Button className="w-full py-4 text-lg" disabled={isSaved}>
          {isSaved ? <><Check size={20} /> Veículo Salvo</> : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
};
