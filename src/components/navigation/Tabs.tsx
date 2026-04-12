"use client";

import React from 'react';
import { Home, Calendar, Trophy, User, LayoutDashboard, Clock, ClipboardList, Settings, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Screen, UserRole } from '@/types';

export const Tabs = ({ 
  currentScreen, 
  userRole, 
  onNavigate 
}: { 
  currentScreen: Screen, 
  userRole: UserRole, 
  onNavigate: (screen: Screen) => void 
}) => {
  const renderNav = (tabs: any[]) => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pb-8 pt-3 flex justify-between items-center z-40 md:top-0 md:bottom-0 md:w-64 md:border-t-0 md:border-r md:flex-col md:justify-start md:pt-8 md:pb-6 md:px-4 md:items-stretch md:gap-2">
      
      {/* Desktop Logo */}
      <div className="hidden md:flex items-center gap-2 px-4 mb-8 text-velo-blue">
        <div className="bg-velo-blue text-white p-1.5 rounded-xl">
           <Car size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">Velo</span>
      </div>

      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id || 
          (tab.id === 'student-profile' && ['student-personal-data', 'student-payments', 'student-settings', 'student-security'].includes(currentScreen)) ||
          (tab.id === 'instructor-profile' && ['instructor-edit-profile', 'instructor-vehicle', 'instructor-availability', 'instructor-payments', 'instructor-settings'].includes(currentScreen));
        
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as Screen)}
            className={cn(
              "flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 transition-all md:px-4 md:py-3 md:rounded-xl",
              isActive 
                ? "text-velo-blue md:bg-blue-50" 
                : "text-slate-400 hover:text-slate-600 md:hover:bg-slate-50 md:hover:text-slate-900"
            )}
          >
            <div className={cn(
              "p-1 md:p-0 rounded-xl transition-all",
              isActive && "bg-blue-50 md:bg-transparent"
            )}>
              <Icon size={24} className="md:w-5 md:h-5" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.2 : 0} />
            </div>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider md:normal-case md:tracking-normal">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  if (userRole === 'student') {
    return renderNav([
      { id: 'student-home', label: 'Início', icon: Home },
      { id: 'student-schedule', label: 'Agenda', icon: Calendar },
      { id: 'student-progress', label: 'Progresso', icon: Trophy },
      { id: 'student-profile', label: 'Perfil', icon: User },
    ]);
  }

  if (userRole === 'instructor') {
    return renderNav([
      { id: 'instructor-dashboard', label: 'Painel', icon: LayoutDashboard },
      { id: 'instructor-schedule', label: 'Agenda', icon: Clock },
      { id: 'instructor-students', label: 'Alunos', icon: ClipboardList },
      { id: 'instructor-profile', label: 'Perfil', icon: Settings },
    ]);
  }

  return null;
};
