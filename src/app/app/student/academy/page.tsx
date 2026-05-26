"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui-custom';
import { QuizModule } from '@/components/features/QuizModule';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useApp } from '@/context/AppContext';
import { submitAcademyScoreAction } from '@/lib/actions/academy';

export default function VeloAcademy() {
  const { academyModules, studentProfile, setAcademyModules } = useApp();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string>(new Date().toISOString());

  const selectedModule = academyModules.find(m => m.id === selectedModuleId);

  const handleOpenModule = (id: string) => {
    setStartedAt(new Date().toISOString());
    setSelectedModuleId(id);
  };

  const handleFinishQuiz = async (score: number, answers: { questionId: string; answer: number }[]) => {
    if (!studentProfile?.id || !selectedModuleId) return;

    const res = await submitAcademyScoreAction(studentProfile.id, answers, startedAt);

    if (res.success && score >= 70) {
      setAcademyModules(prev =>
        prev.map(m => m.id === selectedModuleId ? { ...m, progress: 100 } : m)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {!selectedModuleId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-12 space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Velo Academy</h1>
                <p className="text-slate-500 font-medium">Simulados para fixar o conteúdo teórico.</p>
              </div>
              <div className="hidden md:flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seu Progresso</p>
                  <p className="text-sm font-bold text-slate-900">
                    {academyModules.filter(m => m.progress === 100).length} de {academyModules.length} módulos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-velo-blue flex items-center justify-center">
                  <span className="text-xs font-black">
                    {academyModules.length > 0
                      ? Math.round((academyModules.filter(m => m.progress === 100).length / academyModules.length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {academyModules.length === 0 && (
                <EmptyState
                  icon={BookOpen}
                  title="Nenhum módulo disponível"
                  description="Os simulados ainda não foram publicados. Volte em breve!"
                />
              )}
              {academyModules.map((module, i) => {
                const isCompleted = module.progress === 100;
                return (
                  <Card
                    key={module.id}
                    className={cn(
                      "group flex items-center gap-4 p-5 hover:border-velo-blue/30 transition-all cursor-pointer active:scale-[0.99]",
                      isCompleted ? "bg-white/50" : "bg-white"
                    )}
                    onClick={() => handleOpenModule(module.id)}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      isCompleted ? "bg-velo-green/10 text-velo-green" : "bg-velo-blue/10 text-velo-blue"
                    )}>
                      {isCompleted
                        ? <CheckCircle2 size={24} />
                        : <Play size={24} fill="currentColor" className="ml-1" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Módulo {i + 1}</span>
                        {isCompleted && (
                          <span className="text-[10px] font-black text-velo-green uppercase tracking-widest">• Concluído</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{module.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-slate-400">
                        <p className="text-xs flex items-center gap-1 font-medium"><Clock size={12} /> {module.duration}</p>
                        <p className="text-xs flex items-center gap-1 font-medium"><HelpCircle size={12} /> {module.questions?.length || 0} questões</p>
                      </div>
                    </div>

                    <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:text-velo-blue group-hover:bg-velo-blue/5 transition-colors">
                      <ChevronRight size={24} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
              <button
                onClick={() => setSelectedModuleId(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="font-bold text-slate-900 leading-tight">{selectedModule?.title}</h2>
                <p className="text-xs text-slate-500 font-medium">Simulado</p>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
              <div className="w-full">
                <QuizModule
                  questions={selectedModule?.questions || []}
                  onFinish={handleFinishQuiz}
                  onRestart={() => setSelectedModuleId(null)}
                />
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
