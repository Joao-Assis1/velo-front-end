// src/components/layout/MoreDrawer.tsx
"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

type MoreDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
};

export function MoreDrawer({ isOpen, onClose, items, pathname }: MoreDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — cobre a barra de nav (z-40) e tudo abaixo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Painel deslizante */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[51] pb-safe"
          >
            {/* Handle visual */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Mais páginas
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid de navegação */}
            <div className="grid grid-cols-3 gap-2 px-4 pb-8 max-h-[60vh] overflow-y-auto">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all",
                      isActive
                        ? "bg-blue-50 text-velo-blue"
                        : "text-slate-600 active:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2.5 rounded-xl",
                        isActive
                          ? "bg-velo-blue text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      <item.icon size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
