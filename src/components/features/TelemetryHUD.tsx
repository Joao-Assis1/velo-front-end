"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Signal, SignalHigh, SignalLow, Timer, Map, Navigation, WifiOff } from 'lucide-react';
import { SwipeButton } from '@/components/ui-custom/SwipeButton';
import { cn } from '@/lib/utils';
import { BiometryOverlay } from './BiometryOverlay';
import { BiometryStage } from '@/types';
import { submitTelemetryBatchAction } from '@/lib/actions/lessons';

interface TelemetryHUDProps {
  onFinish: () => void;
  studentName: string;
  lessonId: string;
  studentImage?: string;
}

export const TelemetryHUD = ({ onFinish, studentName, lessonId, studentImage }: TelemetryHUDProps) => {
  const [seconds, setSeconds] = useState(50 * 60); // 50 minutes
  const [gpsStatus, setGpsStatus] = useState<'strong' | 'weak' | 'none'>('none');
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeBiometry, setActiveBiometry] = useState<BiometryStage | null>(null);
  const [telemetryPoints, setTelemetryPoints] = useState<any[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer and Biometry Triggers
  useEffect(() => {
    // Initial Biometry (START) is triggered on mount
    setActiveBiometry('START');

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 0) return 0;
        const next = prev - 1;

        // Trigger MID biometry at 25 minutes remaining (halfway)
        if (next === 25 * 60) {
          setActiveBiometry('MID');
        }

        // Trigger END biometry at 0 minutes
        if (next === 0) {
          setActiveBiometry('END');
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real Geolocation Tracking
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGpsStatus('none');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed: gpsSpeed, accuracy } = pos.coords;
        const timestamp = new Date().toISOString();

        // Accuracy threshold for signal quality
        if (accuracy < 20) setGpsStatus('strong');
        else if (accuracy < 60) setGpsStatus('weak');
        else setGpsStatus('none');

        // Update Speed (m/s to km/h)
        const currentSpeedKmh = gpsSpeed ? Math.round(gpsSpeed * 3.6) : 0;
        setSpeed(currentSpeedKmh);

        // Add to telemetry batch
        setTelemetryPoints(prev => [...prev, {
          lat: latitude,
          lng: longitude,
          velocity: currentSpeedKmh,
          timestamp,
        }]);

        // Calculate Cumulative Distance
        if (lastCoords) {
          const dist = calculateDistance(
            lastCoords.lat,
            lastCoords.lng,
            latitude,
            longitude
          );
          // Only add distance if it's significant (avoid GPS jitter)
          if (dist > 0.005) {
            setDistance(prev => prev + dist);
          }
        }
        setLastCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("GPS Tracking Error:", err);
        setGpsStatus('none');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [lastCoords]);

  // Haversine formula to calculate distance between two points in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    
    try {
      // Send the final batch of telemetry
      if (telemetryPoints.length > 0) {
        await submitTelemetryBatchAction(lessonId, telemetryPoints);
      }
      onFinish();
    } catch (error) {
      console.error("Error sending final telemetry:", error);
      onFinish();
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-[100] flex flex-col p-6 safe-area-inset overflow-hidden">
      <AnimatePresence>
        {activeBiometry && (
          <BiometryOverlay
            lessonId={lessonId}
            studentName={studentName}
            studentImage={studentImage}
            stage={activeBiometry}
            onSuccess={() => {
              if (activeBiometry === 'END') {
                handleFinish();
              }
              setActiveBiometry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* HUD Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-red-500">Telemetria Ativa</span>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          {gpsStatus === 'strong' && <SignalHigh className="text-velo-green" size={20} />}
          {gpsStatus === 'weak' && <SignalLow className="text-amber-500" size={20} />}
          {gpsStatus === 'none' && <WifiOff className="text-red-500" size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">Sinal GPS</span>
        </div>
      </header>

      {/* Main Display */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-2">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Cronômetro de Aula</p>
          <h1 className="text-[80px] md:text-[120px] font-black tabular-nums leading-none tracking-tighter">
            {formatTime(seconds)}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left">
            <Navigation className="text-velo-blue mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocidade</p>
            <p className="text-3xl font-black italic">
              {speed} <span className="text-sm not-italic opacity-40">km/h</span>
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left">
            <Map className="text-velo-blue mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Distância</p>
            <p className="text-3xl font-black italic">
              {distance.toFixed(1)} <span className="text-sm not-italic opacity-40">km</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aluno em instrução</p>
          <p className="text-xl font-bold">{studentName}</p>
        </div>
      </main>

      {/* Footer / Action */}
      <footer className="mt-auto pt-8">
        <SwipeButton
          text={isFinishing ? "Finalizando..." : "Deslize para finalizar"}
          successText="Aula Finalizada"
          onSwipe={handleFinish}
          className="max-w-md mx-auto"
        />
        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">
          Em conformidade com a portaria DETRAN nº 123/2024
        </p>
      </footer>
    </div>
  );
};
