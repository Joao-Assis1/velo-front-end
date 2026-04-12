"use client";

import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';

export const StudentProgress = ({ classes = [] }: { classes?: ScheduledClass[] }) => {
  const totalHoursRequired = 20; // Correcting to standard Brazilian requirement or as intended
  
  // Filter for completed classes
  const completedClasses = classes.filter(c => c.status === 'completed').sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const hoursCompleted = completedClasses.length; // Assuming 1 hour per class for now
  const progressPercentage = Math.min((hoursCompleted / totalHoursRequired) * 100, 100);

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Meu Progresso</h1>
        <p className="text-slate-500 text-sm">Acompanhe sua evolução nas aulas</p>
      </header>

      <Card className="bg-gradient-to-br from-velo-blue to-velo-blue-dark text-white border-none p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-velo-blue-light text-sm font-medium mb-1">Aulas Realizadas</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{hoursCompleted}</span>
              <span className="text-lg text-velo-blue-light/70 font-normal">/ {totalHoursRequired} horas</span>
            </div>
            <p className="text-xs text-velo-blue-light mt-2">
              Mínimo necessário para a prova prática
              <br/>
              <span className="opacity-70">(Res. 1.020/25 CONTRAN)</span>
            </p>
          </div>
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-velo-blue-light/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {/* Progress Circle */}
              <path
                className="text-velo-green drop-shadow-md"
                strokeDasharray={`${progressPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-velo-blue-light font-medium">
            <span>Progresso Total</span>
            <span>{Math.max(0, totalHoursRequired - hoursCompleted)} horas restantes</span>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-velo-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
            />
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm text-velo-blue shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Requisito para a Prova</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Você precisa completar no mínimo <span className="font-bold text-slate-900">{totalHoursRequired} horas</span> de aulas práticas para estar apto a realizar o exame de direção do DETRAN, conforme Resolução 1.020/25 do CONTRAN.
          </p>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Histórico de Aulas</h3>
        <div className="space-y-3">
          {completedClasses.length > 0 ? (
            completedClasses.map(cls => (
              <div key={cls.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-start">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-velo-blue shrink-0 font-bold text-xs flex-col">
                  <span>{format(cls.date, 'dd')}</span>
                  <span className="uppercase text-[10px]">{format(cls.date, 'MMM', { locale: ptBR })}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cls.instructorName}</h4>
                      <p className="text-xs text-slate-500 mb-2">{cls.time} • {cls.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      Concluída
                    </div>
                  </div>
                  
                  {cls.instructorFeedback ? (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 italic border border-slate-100 mt-1 relative">
                      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 rotate-45"></div>
                      "{cls.instructorFeedback}"
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">Nenhum feedback registrado.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">Nenhuma aula concluída ainda.</p>
              <p className="text-xs text-slate-400 mt-1">Suas aulas finalizadas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
