"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-velo-bg">
      {/* Desktop Sidebar — fixed to viewport, fora do flow */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-72 md:z-30">
        <Sidebar />
      </aside>

      {/* Content Area — margin-left libera espaço para o sidebar */}
      <main className="min-h-screen md:ml-72 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-40 px-2 pb-safe">
        <BottomNav />
      </nav>
    </div>
  );
};
