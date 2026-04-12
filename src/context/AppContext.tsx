"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Screen, UserRole, Instructor, Student, ScheduledClass } from '../types';
import { MOCK_INSTRUCTORS, INITIAL_STUDENT_PROFILE, INITIAL_SCHEDULED_CLASSES } from '../constants/mockData';

interface AppContextType {
  screen: Screen;
  userRole: UserRole;
  selectedInstructorId: string | null;
  hasLadv: boolean;
  instructorProfile: Instructor;
  studentProfile: Student;
  scheduledClasses: ScheduledClass[];
  busySlots: Record<string, string[]>;
  
  // Actions
  navigateTo: (screen: Screen) => void;
  setUserRole: (role: UserRole) => void;
  selectInstructor: (id: string) => void;
  setHasLadv: (status: boolean) => void;
  setInstructorProfile: (profile: Instructor) => void;
  setStudentProfile: (profile: Student) => void;
  setScheduledClasses: (classes: ScheduledClass[]) => void;
  setBusySlots: (slots: Record<string, string[]>) => void;
  
  login: () => void;
  register: (ladvUploaded?: boolean) => void;
  logout: () => void;
  
  // Business logic
  cancelClass: (id: string) => void;
  rateClass: (id: string, rating: number, text: string) => void;
  bookClass: (date: Date, time: string, instructor: Instructor) => void;
  giveFeedback: (id: string, feedback: string) => void;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [hasLadv, setHasLadv] = useState(false);
  const [instructorProfile, setInstructorProfile] = useState<Instructor>(MOCK_INSTRUCTORS[0]);
  const [studentProfile, setStudentProfile] = useState<Student>(INITIAL_STUDENT_PROFILE);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>(INITIAL_SCHEDULED_CLASSES);
  const [busySlots, setBusySlots] = useState<Record<string, string[]>>({});

  const navigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const selectInstructor = (id: string) => {
    setSelectedInstructorId(id);
    navigateTo('instructor-profile-view');
  };

  const login = () => {
    if (userRole === 'student') {
      navigateTo('student-home');
    } else {
      navigateTo('instructor-dashboard');
    }
  };

  const register = (ladvUploaded?: boolean) => {
    if (ladvUploaded) {
      setHasLadv(true);
    }
    if (userRole === 'student') {
      navigateTo('student-home');
    } else {
      navigateTo('instructor-dashboard');
    }
  };

  const logout = () => {
    setUserRole(null);
    setHasLadv(false);
    setScreen('onboarding');
  };

  const cancelClass = (id: string) => {
    setScheduledClasses(prev => prev.filter(c => c.id !== id));
  };

  const rateClass = (id: string, rating: number, text: string) => {
    setScheduledClasses(prev => prev.map(c => 
      c.id === id ? { ...c, studentFeedback: { rating, text } } : c
    ));
  };

  const bookClass = (date: Date, time: string, instructor: Instructor) => {
    const newClass: ScheduledClass = {
      id: `class-${Date.now()}`,
      instructorId: instructor.id,
      instructorName: instructor.name,
      date,
      time,
      status: 'upcoming',
      price: instructor.price,
      studentName: studentProfile.name,
      studentImage: studentProfile.image
    };
    setScheduledClasses(prev => [...prev, newClass]);
  };

  const giveFeedback = (id: string, feedback: string) => {
    setScheduledClasses(prev => prev.map(c => 
      c.id === id ? { ...c, instructorFeedback: feedback } : c
    ));
  };

  const checkIn = (id: string) => {
    setScheduledClasses(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'in-progress', checkInTime: new Date() } : c
    ));
  };

  const checkOut = (id: string) => {
    setScheduledClasses(prev => prev.map(c => {
      if (c.id === id) {
        const checkOutTime = new Date();
        const checkInTime = c.checkInTime || new Date();
        const durationMinutes = Math.max(1, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000));
        return { ...c, status: 'completed', checkOutTime, durationMinutes };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        screen,
        userRole,
        selectedInstructorId,
        hasLadv,
        instructorProfile,
        studentProfile,
        scheduledClasses,
        busySlots,
        navigateTo,
        setUserRole,
        selectInstructor,
        setHasLadv,
        setInstructorProfile,
        setStudentProfile,
        setScheduledClasses,
        setBusySlots,
        login,
        register,
        logout,
        cancelClass,
        rateClass,
        bookClass,
        giveFeedback,
        checkIn,
        checkOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
