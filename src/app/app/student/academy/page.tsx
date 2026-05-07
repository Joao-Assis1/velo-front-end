"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/ui-custom';
import { VideoPlayer } from '@/components/features/VideoPlayer';
import { QuizModule } from '@/components/features/QuizModule';
import { useApp } from '@/context/AppContext';
import { AcademyModule } from '@/types';

export default function VeloAcademy() {
  const { academyModules } = useApp();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [view, setView] = useState<'video' | 'quiz'>('video');

  const selectedModule = academyModules.find(m => m.id === selectedModuleId);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {!selectedModuleId ? (
          /* Module List View */
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-12 max-w-4xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Velo Academy</h1>
                <p className="text-slate-500 font-medium">Sua trilha para a aprovação teórica.</p>
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
                    {Math.round((academyModules.filter(m => m.progress === 100).length / academyModules.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {academyModules.map((module, i) => {
                const isCompleted = module.progress === 100;
                return (
                  <Card 
                    key={module.id}
                    className={cn(
                      "group flex items-center gap-4 p-5 hover:border-velo-blue/30 transition-all cursor-pointer active:scale-[0.99]",
                      isCompleted ? "bg-white/50" : "bg-white"
                    )}
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      isCompleted ? "bg-velo-green/10 text-velo-green" : "bg-velo-blue/10 text-velo-blue"
                    )}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Módulo {i + 1}</span>
                        {isCompleted && <span className="text-[10px] font-black text-velo-green uppercase tracking-widest">• Concluído</span>}
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
          /* Learning View (Video/Quiz) */
          <motion.div 
            key="learning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            {/* Learning Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedModuleId(null)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 className="font-bold text-slate-900 leading-tight">{selectedModule?.title}</h2>
                  <p className="text-xs text-slate-500 font-medium">Módulo de Estudo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={view === 'video' ? 'primary' : 'ghost'} 
                  size="sm"
                  onClick={() => setView('video')}
                  className="text-xs h-9 px-4"
                >
                  Aula
                </Button>
                <Button 
                  variant={view === 'quiz' ? 'primary' : 'ghost'} 
                  size="sm"
                  onClick={() => setView('quiz')}
                  disabled={!selectedModule?.questions.length}
                  className="text-xs h-9 px-4"
                >
                  Simulado
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
              <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {view === 'video' ? (
                    <motion.div 
                      key="video-view"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-8"
                    >
                      <VideoPlayer 
                        title={selectedModule?.title} 
                        onComplete={() => console.log('Video watched!')} 
                      />
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-velo-blue">
                          <BookOpen size={20} />
                          <h3 className="font-bold">Resumo da Aula</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Neste módulo, abordaremos os conceitos fundamentais sobre {selectedModule?.title.toLowerCase()}. 
                          Preste atenção aos detalhes apresentados no vídeo, pois eles serão cobrados no simulado ao final.
                        </p>
                        <Button 
                          onClick={() => setView('quiz')}
                          className="w-full md:w-auto"
                          disabled={!selectedModule?.questions.length}
                        >
                          Ir para o Simulado
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="quiz-view"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="max-w-2xl mx-auto w-full"
                    >
                      <QuizModule 
                        questions={selectedModule?.questions || []} 
                        onFinish={(score) => console.log('Score:', score)}
                        onRestart={() => setView('video')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
