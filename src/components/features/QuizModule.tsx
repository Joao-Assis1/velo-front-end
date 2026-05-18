"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom';

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

interface QuizModuleProps {
  questions: QuizQuestion[];
  onFinish: (score: number, answers: { questionId: string; answer: number }[]) => void;
  onRestart: () => void;
  onNextModule?: () => void;
}

export const QuizModule = ({ questions, onFinish, onRestart, onNextModule }: QuizModuleProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; answer: number }[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    
    // Map A=0, B=1, C=2, D=3
    const answerIndex = selectedOptionId.charCodeAt(0) - 65;

    setUserAnswers(prev => [...prev, { questionId: currentQuestion.id, answer: answerIndex }]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onFinish((score / questions.length) * 100, userAnswers);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    onRestart();
  };

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6"
      >
        <div className={cn(
          "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4",
          passed ? "bg-velo-green/10 text-velo-green" : "bg-red-50 text-red-500"
        )}>
          {passed ? <Award size={48} /> : <RotateCcw size={48} />}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {passed ? "Parabéns! Você passou!" : "Não foi desta vez..."}
          </h3>
          <p className="text-slate-500">
            Você acertou {score} de {totalQuestions} questões ({percentage}%).
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-700">
            {passed 
              ? "Excelente desempenho! Você concluiu este módulo com sucesso." 
              : "Você precisa de pelo menos 70% de acertos para avançar. Revise o conteúdo e tente novamente."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className={cn("w-full py-4", passed ? "bg-velo-blue" : "bg-slate-900")}
            onClick={passed ? (onNextModule ?? (() => onFinish(percentage))) : handleRestart}
          >
            {passed ? "Próximo Módulo" : "Tentar Novamente"}
          </Button>
          <Button variant="ghost" onClick={handleRestart} className="text-slate-500">
            Revisar Questões
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-xs font-black text-velo-blue uppercase tracking-widest">Simulado em andamento</p>
          <h3 className="text-lg font-bold text-slate-900">Questão {currentQuestionIndex + 1} de {totalQuestions}</h3>
        </div>
        <span className="text-sm font-bold text-slate-400">{Math.round(progress)}%</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-velo-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <p className="text-xl font-bold text-slate-800 leading-tight">
          {currentQuestion.text}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = isAnswered && option.id === currentQuestion.correctOptionId;
            const isWrong = isAnswered && isSelected && option.id !== currentQuestion.correctOptionId;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isAnswered}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                  isSelected && !isAnswered ? "border-velo-blue bg-blue-50/50 shadow-md ring-4 ring-velo-blue/5" :
                  isCorrect ? "border-velo-green bg-green-50 text-green-900" :
                  isWrong ? "border-red-500 bg-red-50 text-red-900" :
                  "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                    isSelected && !isAnswered ? "bg-velo-blue text-white" :
                    isCorrect ? "bg-velo-green text-white" :
                    isWrong ? "bg-red-500 text-white" :
                    "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}>
                    {option.id}
                  </div>
                  <span className="font-semibold text-sm leading-snug">{option.text}</span>
                </div>

                {isCorrect && <CheckCircle2 className="text-velo-green" size={20} />}
                {isWrong && <XCircle className="text-red-500" size={20} />}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Action Footer */}
      <div className="pt-4">
        {!isAnswered ? (
          <Button 
            className="w-full py-5 text-lg shadow-lg shadow-velo-blue/20"
            disabled={!selectedOptionId}
            onClick={handleConfirmAnswer}
          >
            Confirmar Resposta
          </Button>
        ) : (
          <Button 
            className="w-full py-5 text-lg bg-slate-900 group"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Próxima Questão" : "Ver Resultado"}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
