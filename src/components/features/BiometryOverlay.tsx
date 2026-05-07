"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, ShieldCheck, UserCheck, Loader2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BiometryOverlayProps {
  studentName: string;
  studentImage?: string;
  onSuccess: () => void;
  type: 'check-in' | 'check-out';
}

export const BiometryOverlay = ({ studentName, studentImage, onSuccess, type }: BiometryOverlayProps) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success'>('idle');

  useEffect(() => {
    if (status === 'scanning') {
      const timer = setTimeout(() => setStatus('verifying'), 3000);
      return () => clearTimeout(timer);
    }
    if (status === 'verifying') {
      const timer = setTimeout(() => {
        setStatus('success');
        setTimeout(onSuccess, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onSuccess]);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[110] flex flex-col items-center justify-center p-6 text-white">
      {/* Scanning Target */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12">
        {/* Frame Corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-velo-blue rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-velo-blue rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-velo-blue rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-velo-blue rounded-br-3xl" />

        {/* User Image / Placeholder */}
        <div className="absolute inset-4 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
          {studentImage ? (
            <img src={studentImage} alt={studentName} className="w-full h-full object-cover opacity-50 grayscale" />
          ) : (
            <Camera size={64} className="text-slate-600" />
          )}
          
          {/* Scanning Line */}
          {status === 'scanning' && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-velo-blue shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
            />
          )}

          {/* Success Overlay */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-velo-green/20 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <div className="bg-velo-green text-white p-4 rounded-full shadow-2xl">
                  <UserCheck size={48} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info & Status */}
      <div className="text-center space-y-4 max-w-sm">
        <div className="flex items-center justify-center gap-2 text-velo-blue">
          <ShieldCheck size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Validação Biométrica</span>
        </div>

        <h2 className="text-2xl font-bold">
          {status === 'idle' && `Confirmar ${type === 'check-in' ? 'Início' : 'Fim'} da Aula`}
          {status === 'scanning' && "Escaneando face..."}
          {status === 'verifying' && "Verificando identidade..."}
          {status === 'success' && "Identidade confirmada!"}
        </h2>

        <p className="text-slate-400 text-sm">
          {status === 'idle' && `Posicione o dispositivo para que ${studentName} possa realizar o reconhecimento facial.`}
          {status === 'scanning' && "Mantenha o dispositivo parado e o rosto visível no quadro."}
          {status === 'verifying' && "Cruzando dados com a base do DETRAN..."}
          {status === 'success' && "Aula validada com sucesso. Sincronizando dados..."}
        </p>

        {status === 'idle' && (
          <button 
            onClick={() => setStatus('scanning')}
            className="w-full mt-8 bg-velo-blue hover:bg-velo-blue-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-velo-blue/20 flex items-center justify-center gap-3 transition-all"
          >
            <Scan size={24} /> Iniciar Escaneamento
          </button>
        )}

        {(status === 'scanning' || status === 'verifying') && (
          <div className="flex items-center justify-center mt-8 text-velo-blue">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
      </div>
    </div>
  );
};
