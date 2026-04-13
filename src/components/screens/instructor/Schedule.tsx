"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, Play, Square } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';

export const InstructorSchedule = ({ 
  classes, 
  onGiveFeedback, 
  onCheckIn, 
  onCheckOut,
  onNavigate
}: { 
  classes: ScheduledClass[], 
  onGiveFeedback: (id: string, feedback: string) => void, 
  onCheckIn: (id: string) => void, 
  onCheckOut: (id: string) => void,
  onNavigate: (screen: any) => void
}) => {
  // Sort classes by date and time
  const sortedClasses = [...classes].sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const upcomingClasses = sortedClasses.filter(c => c.status === 'upcoming' || c.status === 'in-progress');
  const pastClasses = sortedClasses.filter(c => c.status === 'completed' || c.status === 'cancelled').reverse();

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda Completa</h1>
          <p className="text-slate-500 text-sm">Gerencie suas aulas e horários</p>
        </div>
        <button 
          onClick={() => onNavigate('instructor-availability')}
          className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <Calendar size={18} />
          <span>Disponibilidade</span>
        </button>
      </header>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-velo-blue" />
          Próximas Aulas
        </h2>
        <div className="space-y-4">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((cls) => (
              <Card key={cls.id} className={cn(
                "border-l-4 p-5",
                cls.status === 'in-progress' ? "border-l-orange-500 bg-orange-50/30" : "border-l-velo-blue"
              )}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                      <img src={cls.studentImage || `https://ui-avatars.com/api/?name=${cls.studentName}`} alt={cls.studentName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{cls.studentName || 'Aluno'}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {format(cls.date, "dd 'de' MMM", { locale: ptBR })} • {cls.startTime}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                    cls.status === 'in-progress' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-velo-blue"
                  )}>
                    {cls.status === 'in-progress' ? 'Em andamento' : 'Agendada'}
                  </span>
                </div>

                <div className="flex gap-3">
                  {cls.status === 'upcoming' ? (
                    <Button 
                      className="flex-1 bg-velo-blue text-white"
                      onClick={() => onCheckIn(cls.id)}
                    >
                      <Play size={16} /> Iniciar Aula
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 bg-orange-500 text-white"
                      onClick={() => onCheckOut(cls.id)}
                    >
                      <Square size={16} /> Finalizar Aula
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState 
              icon={Calendar}
              title="Sem agendamentos"
              description="Você não tem nenhuma aula agendada para os próximos dias."
              className="py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed"
            />
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Histórico Recente</h2>
        <div className="space-y-3">
          {pastClasses.length > 0 ? (
            pastClasses.slice(0, 5).map((cls) => (
              <Card key={cls.id} className="bg-slate-50 border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 grayscale opacity-70">
                        <img src={cls.studentImage || `https://ui-avatars.com/api/?name=${cls.studentName}`} alt={cls.studentName} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 text-sm">{cls.studentName || 'Aluno'}</p>
                        <p className="text-[10px] text-slate-400">
                          {format(cls.date, "dd/MM/yyyy", { locale: ptBR })} • {cls.startTime}
                        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                      cls.status === 'completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {cls.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">R$ {cls.price || 0}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-4">Nenhum histórico disponível.</p>
          )}
        </div>
      </section>
    </div>
  );
};
