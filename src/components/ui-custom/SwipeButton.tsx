"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'motion/react';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeButtonProps {
  onSwipe: () => void;
  text: string;
  successText?: string;
  className?: string;
}

export const SwipeButton = ({ onSwipe, text, successText = "Concluído", className }: SwipeButtonProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Range of movement (will be updated on mount)
  const [range, setRange] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const handleWidth = 64; // w-16
      setRange(containerWidth - handleWidth - 8); // 8 for padding
    }
  }, []);

  const opacity = useTransform(x, [0, range * 0.5], [1, 0]);
  const scale = useTransform(x, [0, range], [1, 1.1]);

  const handleDragEnd = async () => {
    if (x.get() > range * 0.8) {
      await controls.start({ x: range, transition: { duration: 0.2 } });
      setIsSuccess(true);
      onSwipe();
    } else {
      controls.start({ x: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative h-20 bg-slate-900 rounded-full p-2 overflow-hidden flex items-center select-none shadow-xl",
        isSuccess ? "bg-velo-green" : "",
        className
      )}
    >
      {/* Background Text */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-white/40 font-black uppercase tracking-widest text-sm ml-8">
          {text}
        </span>
      </motion.div>

      {/* Swipe Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: range }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, scale }}
        className={cn(
          "w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg",
          isSuccess ? "cursor-default" : ""
        )}
      >
        {isSuccess ? (
          <Check className="text-velo-green" size={32} strokeWidth={3} />
        ) : (
          <ChevronRight className="text-slate-900" size={32} strokeWidth={3} />
        )}
      </motion.div>

      {/* Success State */}
      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-white font-black uppercase tracking-widest text-lg">
            {successText}
          </span>
        </motion.div>
      )}
    </div>
  );
};
