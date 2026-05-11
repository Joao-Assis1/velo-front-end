"use client";

import React, { useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Maximize, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url?: string;
  title?: string;
  onComplete?: () => void;
}

export const VideoPlayer = ({ url, title, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(current);
      if (current >= 99 && onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="relative group bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
      {/* Actual Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onLoadStart={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        src={url || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
      />

      {/* Buffering Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <Loader2 className="text-white animate-spin" size={48} />
        </div>
      )}

      {/* Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 flex flex-col justify-between p-6",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}>
        <div className="flex justify-between items-start">
          <h4 className="text-white font-bold text-lg drop-shadow-md">{title || "Aula Teórica"}</h4>
          <button onClick={handleRestart} className="text-white/70 hover:text-white transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Progress Bar */}
          <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="absolute left-0 top-0 h-full bg-velo-blue transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              <div className="flex items-center gap-2 text-white/80">
                <Volume2 size={20} />
                <div className="w-16 h-1 bg-white/30 rounded-full">
                  <div className="w-2/3 h-full bg-white rounded-full" />
                </div>
              </div>
            </div>

            <button onClick={handleFullscreen} className="text-white/70 hover:text-white transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isBuffering && (
        <button 
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-20 h-20 bg-velo-blue text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-20"
        >
          <Play size={40} fill="currentColor" className="ml-2" />
        </button>
      )}
    </div>
  );
};
