"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, ShieldCheck, UserCheck, Loader2, Camera, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitBiometryAction } from '@/lib/actions/lessons';
import { BiometryStage } from '@/types';

interface BiometryOverlayProps {
  lessonId: string;
  studentName: string;
  studentImage?: string;
  onSuccess: () => void;
  onClose?: () => void;
  stage: BiometryStage;
}

export const BiometryOverlay = ({ lessonId, studentName, studentImage, onSuccess, onClose, stage }: BiometryOverlayProps) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === 'scanning') {
      startCamera();
    } else if (status === 'idle') {
      stopCamera();
    }
    
    return () => {
      stopCamera();
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [status]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setStatus('error');
      setErrorMessage('Não foi possível acessar a câmera. Verifique as permissões do seu navegador.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const getCurrentCoords = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        resolve({ lat: 0, lng: 0 });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 0, lng: 0 }),
        { timeout: 5000 },
      );
    });

  const captureAndSubmit = async () => {
    if (!videoRef.current || !streamRef.current) return;

    try {
      setStatus('verifying');

      const coords = await getCurrentCoords();
      const result = await submitBiometryAction(lessonId, stage, coords, "SUCCESS");

      if (result.success) {
        setStatus('success');
        successTimeoutRef.current = setTimeout(() => {
          stopCamera();
          onSuccess();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Falha na validação biométrica com o DETRAN.');
      }
    } catch (err: any) {
      console.error("Erro na biometria:", err);
      setStatus('error');
      setErrorMessage(err.message || 'Ocorreu um erro inesperado durante a validação.');
    }
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'START': return 'Check-in (Início)';
      case 'MID': return 'Verificação (Meio)';
      case 'END': return 'Check-out (Fim)';
      default: return 'Biometria';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[110] flex flex-col items-center justify-center p-6 text-white">
      {onClose && status !== 'verifying' && status !== 'success' && (
        <button
          onClick={() => { stopCamera(); onClose(); }}
          aria-label="Fechar biometria"
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={24} />
        </button>
      )}

      {/* Scanning Target */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12">
        {/* Frame Corners */}
        <div className={cn(
          "absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl z-30 transition-colors duration-500",
          status === 'success' ? "border-velo-green" : status === 'error' ? "border-red-500" : "border-velo-blue"
        )} />
        <div className={cn(
          "absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl z-30 transition-colors duration-500",
          status === 'success' ? "border-velo-green" : status === 'error' ? "border-red-500" : "border-velo-blue"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl z-30 transition-colors duration-500",
          status === 'success' ? "border-velo-green" : status === 'error' ? "border-red-500" : "border-velo-blue"
        )} />
        <div className={cn(
          "absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl z-30 transition-colors duration-500",
          status === 'success' ? "border-velo-green" : status === 'error' ? "border-red-500" : "border-velo-blue"
        )} />

        {/* Camera Feed / User Image */}
        <div className="absolute inset-4 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
          {status === 'idle' && (
            studentImage ? (
              <img src={studentImage} alt={studentName} className="w-full h-full object-cover opacity-50 grayscale" />
            ) : (
              <Camera size={64} className="text-slate-600" />
            )
          )}

          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={cn(
              "w-full h-full object-cover",
              status === 'idle' ? "hidden" : "block",
              status === 'verifying' && "opacity-50 grayscale"
            )}
          />
          
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
                className="absolute inset-0 bg-velo-green/20 backdrop-blur-sm flex items-center justify-center z-40"
              >
                <div className="bg-velo-green text-white p-4 rounded-full shadow-2xl">
                  <UserCheck size={48} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Overlay */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-40"
              >
                <div className="bg-red-500 text-white p-4 rounded-full shadow-2xl">
                  <AlertCircle size={48} />
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
          <span className="text-xs font-black uppercase tracking-widest">Conformidade CONTRAN 1.020/2025</span>
        </div>

        <h2 className="text-2xl font-bold">
          {status === 'idle' && `Validar ${getStageTitle()}`}
          {status === 'scanning' && "Escaneando face..."}
          {status === 'verifying' && "Verificando identidade..."}
          {status === 'success' && "Identidade confirmada!"}
          {status === 'error' && "Falha na validação"}
        </h2>

        <p className="text-slate-400 text-sm">
          {status === 'idle' && `Posicione o rosto de ${studentName} no quadro para validar o estágio da aula.`}
          {status === 'scanning' && "Mantenha o rosto visível e imóvel."}
          {status === 'verifying' && "Validando biometria com a base do governo..."}
          {status === 'success' && "Aula validada com sucesso. Prosseguindo..."}
          {status === 'error' && errorMessage}
        </p>

        {status === 'idle' && (
          <button 
            onClick={() => setStatus('scanning')}
            className="w-full mt-8 bg-velo-blue hover:bg-velo-blue-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-velo-blue/20 flex items-center justify-center gap-3 transition-all"
          >
            <Scan size={24} /> Iniciar Câmera
          </button>
        )}

        {status === 'scanning' && (
          <button 
            onClick={captureAndSubmit}
            className="w-full mt-8 bg-velo-blue hover:bg-velo-blue-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-velo-blue/20 flex items-center justify-center gap-3 transition-all"
          >
            <Camera size={24} /> Capturar e Validar
          </button>
        )}

        {status === 'error' && (
          <button 
            onClick={() => setStatus('idle')}
            className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl font-bold transition-all"
          >
            Tentar Novamente
          </button>
        )}

        {status === 'verifying' && (
          <div className="flex items-center justify-center mt-8 text-velo-blue">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
      </div>
    </div>
  );
};

