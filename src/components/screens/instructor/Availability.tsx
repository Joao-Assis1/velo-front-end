"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button, Input, Card } from '@/components/ui-custom';
import { Instructor, BusySlot } from '@/types';

export const InstructorAvailability = ({ 
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

  const handleToggleDay = (day: number) => {
    if (!localProfile) return;
    const newAvailability = [...(localProfile.availability || [])];
    const index = newAvailability.findIndex(a => a.dayOfWeek === day);
    
    if (index >= 0) {
      newAvailability[index] = { ...newAvailability[index], isEnabled: !newAvailability[index].isEnabled };
    } else {
      newAvailability.push({ dayOfWeek: day, startTime: '08:00', endTime: '18:00', isEnabled: true });
    }
    
    setLocalProfile({ ...localProfile, availability: newAvailability });
  };

  const handleTimeChange = (day: number, field: 'startTime' | 'endTime', value: string) => {
    if (!localProfile) return;
    const newAvailability = [...(localProfile.availability || [])];
    const index = newAvailability.findIndex(a => a.dayOfWeek === day);
    
    if (index >= 0) {
      newAvailability[index] = { ...newAvailability[index], [field]: value };
      setLocalProfile({ ...localProfile, availability: newAvailability });
    }
  };

  const handleAddBusySlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localProfile) return;
    const form = e.target as HTMLFormElement;
    const dateInput = form.elements.namedItem('date') as HTMLInputElement;
    const startInput = form.elements.namedItem('start') as HTMLInputElement;
    const endInput = form.elements.namedItem('end') as HTMLInputElement;

    if (dateInput.value && startInput.value && endInput.value) {
      const newBusySlot: BusySlot = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(dateInput.value + 'T00:00:00'),
        startTime: startInput.value,
        endTime: endInput.value
      };
      
      setLocalProfile({
        ...localProfile,
        busySlots: [...(localProfile.busySlots || []), newBusySlot]
      });
      
      form.reset();
    }
  };

  const handleRemoveBusySlot = (id: string) => {
    if (!localProfile) return;
    setLocalProfile({
      ...localProfile,
      busySlots: (localProfile.busySlots || []).filter(s => s.id !== id)
    });
  };

  if (!profile && !localProfile.id) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velo-blue"></div>
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Disponibilidade</h1>
      </header>

      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Horários de Trabalho</h3>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => onSave(localProfile)}>Salvar Tudo</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day];
              const dayAvailability = localProfile.availability?.find(a => a.dayOfWeek === day) || { dayOfWeek: day, startTime: '08:00', endTime: '18:00', isEnabled: false };
              
              return (
                <div key={day} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-700">{dayName}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={dayAvailability.isEnabled}
                        onChange={() => handleToggleDay(day)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-velo-blue"></div>
                    </label>
                  </div>
                  
                  {dayAvailability.isEnabled && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Início</label>
                        <input 
                          type="time" 
                          value={dayAvailability.startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <span className="text-slate-400 mt-5">-</span>
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Fim</label>
                        <input 
                          type="time" 
                          value={dayAvailability.endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-slate-900 mb-4">Bloqueios de Agenda</h3>
          
          <Card className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Adicionar Bloqueio</h4>
            <form onSubmit={handleAddBusySlot} className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Data</label>
                <input name="date" type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Início</label>
                  <input name="start" type="time" className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Fim</label>
                  <input name="end" type="time" className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
                </div>
              </div>
              <Button type="submit" size="sm" className="w-full py-2">
                Adicionar Bloqueio
              </Button>
            </form>
          </Card>

          <div className="space-y-2">
            {localProfile.busySlots?.map((slot) => (
              <div key={slot.id} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{format(new Date(slot.date), "dd 'de' MMMM", { locale: ptBR })}</p>
                  <p className="text-xs text-slate-500">{slot.startTime} - {slot.endTime}</p>
                </div>
                <button 
                  onClick={() => handleRemoveBusySlot(slot.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(!localProfile.busySlots || localProfile.busySlots.length === 0) && (
              <p className="text-center text-slate-400 text-sm py-4">Nenhum bloqueio cadastrado.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
