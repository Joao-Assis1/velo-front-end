"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Users, MessageCircle, CheckCircle2 } from 'lucide-react';
import { isToday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/ui-custom';
import { ScheduledClass, Instructor } from '@/types';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { Calendar, History, AlertCircle } from 'lucide-react';
import { KPISection } from '@/components/features/KPISection';

export const InstructorDashboard = ({ 
  profile,
  onViewSchedule, 
  classes, 
  onGiveFeedback 
}: { 
  profile: Instructor | null,
  onViewSchedule: () => void, 
  classes: ScheduledClass[], 
  onGiveFeedback: (id: string, feedback: string) => void 
}) => {
  const { availableBalance, pendingBalance } = useApp();

  // Filter classes for the current instructor
  const myClasses = classes.filter(c => c.instructorId === profile?.id);
  
  const todayClasses = myClasses.filter(c => isToday(c.date));
  const completedClasses = myClasses.filter(c => c.status === 'completed').sort((a, b) => b.date.getTime() - a.date.getTime());

  // Mock financial data (additional)
  const monthlyEarnings = 3800.00;
  const growth = 12.5;

  const [feedbackClassId, setFeedbackClassId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = () => {
    if (feedbackClassId && feedbackText) {
      onGiveFeedback(feedbackClassId, feedbackText);
      setFeedbackClassId(null);
      setFeedbackText('');
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 space-y-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm font-medium">Painel de Gestão</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Olá, {profile?.name?.split(' ')[0] || 'Instrutor'}</h1>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
          {profile ? (
            <img src={profile.profilePicture || "https://ui-avatars.com/api/?name=" + profile.name} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="animate-pulse w-full h-full bg-slate-300"></div>
          )}
        </div>
      </header>

      {/* Critical Alerts */}
      <section className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-900">Credencial Vencendo</h4>
          <p className="text-xs text-red-700">Sua credencial do DETRAN vence em 5 dias. Regularize para evitar bloqueios.</p>
        </div>
        <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 shadow-none text-[10px] px-3 py-1">Renovar</Button>
      </section>

      {/* KPIs */}
      <KPISection 
        availableBalance={availableBalance}
        pendingBalance={pendingBalance}
        monthlyEarnings={monthlyEarnings}
        growth={growth}
      />

      {/* Today's Schedule */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Agenda de Hoje</h2>
          {todayClasses.length > 0 && (
            <button onClick={onViewSchedule} className="text-velo-blue text-sm font-medium">Ver tudo</button>
          )}
        </div>
        
        <div className="space-y-3">
          {todayClasses.length > 0 ? (
            todayClasses.map((item, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-14 text-center">
                  <p className="font-bold text-slate-900">{item.startTime}</p>
                </div>
                <Card className={cn(
                  "flex-1 flex justify-between items-center p-3 border-l-4",
                  item.status === 'completed' ? "border-l-velo-green bg-slate-50 opacity-70" : 
                  item.status === 'in-progress' ? "border-l-orange-500 bg-orange-50/50" : "border-l-velo-blue"
                )}>
                  <div>
                    <p className="font-bold text-slate-900">{item.studentName || 'Aluno'}</p>
                    <p className={cn("text-xs font-medium", item.status === 'in-progress' ? "text-orange-600" : "text-slate-500")}>
                      {item.status === 'in-progress' ? 'Em andamento' : 'Aula Prática'}
                    </p>
                  </div>
                  {item.status === 'completed' ? (
                    <CheckCircle2 size={20} className="text-velo-green" />
                  ) : (
                    <button onClick={() => alert(`Abrindo chat...`)} className="w-8 h-8 rounded-full bg-velo-blue-light text-velo-blue flex items-center justify-center hover:bg-velo-blue hover:text-white transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <EmptyState 
              icon={Calendar}
              title="Sem aulas para hoje"
              description="Sua agenda está livre. Aproveite para descansar ou organizar seus horários."
              className="py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed"
            />
          )}
        </div>
      </section>

      {/* Completed Classes / Feedback */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Aulas Concluídas (Feedback)</h2>
        <div className="space-y-3">
          {completedClasses.length > 0 ? (
            completedClasses.map((cls) => (
              <Card key={cls.id} className="bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-900">{cls.studentName || 'Aluno'}</p>
                    <p className="text-sm text-slate-500">
                      {format(cls.date, "dd/MM/yyyy", { locale: ptBR })} • {cls.startTime}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Concluída
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200">
                   {cls.instructorFeedback ? (
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <p className="text-xs font-bold text-velo-blue mb-1 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Feedback Enviado
                        </p>
                        <p className="text-xs text-slate-600 italic">"{cls.instructorFeedback}"</p>
                      </div>
                   ) : (
                      <button 
                        onClick={() => setFeedbackClassId(cls.id)}
                        className="w-full py-2 text-sm font-medium text-velo-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} /> Dar Feedback ao Aluno
                      </button>
                   )}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState 
              icon={History}
              title="Nenhum histórico"
              description="Suas aulas concluídas aparecerão aqui para você dar feedback aos alunos."
              className="py-8"
            />
          )}
        </div>
      </section>

      <AnimatePresence>
        {feedbackClassId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setFeedbackClassId(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Feedback para o Aluno</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Comentário</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-velo-blue focus:border-transparent outline-none resize-none text-sm"
                  rows={4}
                  placeholder="Como foi o desempenho do aluno?"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setFeedbackClassId(null)}>
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-velo-blue hover:bg-velo-blue-dark text-white" 
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                >
                  Enviar Feedback
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
