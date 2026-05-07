"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-velo-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Content Area */}
      <main className="flex-1 md:pl-72 min-h-screen pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 px-2 pb-safe">
        <BottomNav />
      </nav>
    </div>
  );
};
