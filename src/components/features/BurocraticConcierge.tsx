"use client";

import React from 'react';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type AlertType = 'urgent' | 'warning' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
}

interface BurocraticConciergeProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

const typeStyles = {
  urgent: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: <AlertCircle className="text-red-500" size={24} />,
    badge: "bg-red-100 text-red-700",
    label: "Urgente"
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    icon: <AlertTriangle className="text-amber-500" size={24} />,
    badge: "bg-amber-100 text-amber-700",
    label: "Atenção"
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: <Info className="text-blue-500" size={24} />,
    badge: "bg-blue-100 text-blue-700",
    label: "Informativo"
  }
};

export const BurocraticConcierge = ({ alerts, onDismiss }: BurocraticConciergeProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "relative p-4 rounded-2xl border flex gap-4 items-start shadow-sm",
              typeStyles[alert.type].container
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {typeStyles[alert.type].icon}
            </div>
            
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", typeStyles[alert.type].badge)}>
                  {typeStyles[alert.type].label}
                </span>
                <h4 className="font-bold text-sm leading-tight">{alert.title}</h4>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">{alert.message}</p>
            </div>

            {onDismiss && (
              <button 
                onClick={() => onDismiss(alert.id)}
                className="absolute top-3 right-3 p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={16} className="opacity-40" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
