"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl mx-auto"
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button
                onClick={onConfirm}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95",
                  destructive
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-velo-blue text-white hover:bg-blue-700"
                )}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
