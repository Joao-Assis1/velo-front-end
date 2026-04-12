"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const CalendarWidget = ({ 
  selectedDate, 
  onSelectDate,
  availableDates = []
}: { 
  selectedDate: Date | null, 
  onSelectDate: (date: Date) => void,
  availableDates?: Date[]
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-bold text-slate-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-slate-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors relative",
                !isCurrentMonth && "text-slate-300",
                isCurrentMonth && !isSelected && "text-slate-700 hover:bg-slate-100",
                isSelected && "bg-velo-blue text-white font-medium shadow-md",
                isDayToday && !isSelected && "text-velo-blue font-bold bg-blue-50"
              )}
            >
              {format(day, 'd')}
              {isDayToday && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-velo-blue rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
