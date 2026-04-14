"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Screen, UserRole, Instructor, Student, ScheduledClass } from '../types';
import { 
  createLessonAction, 
  checkInAction, 
  checkOutAction, 
  submitStudentFeedbackAction, 
  submitInstructorFeedbackAction,
  getLessonsAction
} from '@/lib/actions/lessons';
import { 
  loginStudentAction, 
  loginInstructorAction,
  registerStudentAction,
  registerInstructorAction
} from '@/lib/actions/auth';

interface AppContextType {
  screen: Screen;
  userRole: UserRole;
  selectedInstructorId: string | null;
  hasLadv: boolean;
  instructorProfile: Instructor | null;
  studentProfile: Student | null;
  scheduledClasses: ScheduledClass[];
  busySlots: Record<string, string[]>;
  
  // Actions
  navigateTo: (screen: Screen) => void;
  setUserRole: (role: UserRole) => void;
  selectInstructor: (id: string) => void;
  setHasLadv: (status: boolean) => void;
  setInstructorProfile: (profile: Instructor | null) => void;
  setStudentProfile: (profile: Student | null) => void;
  setScheduledClasses: (classes: ScheduledClass[]) => void;
  setBusySlots: (slots: Record<string, string[]>) => void;
  
  login: () => void;
  register: (data: any) => void;
  logout: () => void;
  
  // Business logic
  cancelClass: (id: string) => void;
  rateClass: (id: string, rating: number, text: string) => void;
  bookClass: (date: Date, startTime: string, endTime: string, instructor: Instructor) => void;
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
  const [instructorProfile, setInstructorProfile] = useState<Instructor | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);
  const [busySlots, setBusySlots] = useState<Record<string, string[]>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const persistedUserRole = localStorage.getItem('velo-userRole');
      const persistedScreen = localStorage.getItem('velo-screen');
      const persistedInstructorProfile = localStorage.getItem('velo-instructorProfile');
      const persistedStudentProfile = localStorage.getItem('velo-studentProfile');
      const persistedHasLadv = localStorage.getItem('velo-hasLadv');

      if (persistedUserRole) {
        // Only set parsed role if valid
        const parsedData = JSON.parse(persistedUserRole);
        if (parsedData === 'student' || parsedData === 'instructor') {
          setUserRole(parsedData);
        }
      }
      
      if (persistedScreen) setScreen(persistedScreen as Screen);
      if (persistedInstructorProfile && persistedInstructorProfile !== 'undefined') setInstructorProfile(JSON.parse(persistedInstructorProfile));
      if (persistedStudentProfile && persistedStudentProfile !== 'undefined') setStudentProfile(JSON.parse(persistedStudentProfile));
      if (persistedHasLadv) setHasLadv(JSON.parse(persistedHasLadv));
    } catch (e) {
      console.warn("Failed to parse local storage details");
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('velo-screen', screen);
    localStorage.setItem('velo-userRole', JSON.stringify(userRole));
    localStorage.setItem('velo-hasLadv', JSON.stringify(hasLadv));
    if (instructorProfile) {
      localStorage.setItem('velo-instructorProfile', JSON.stringify(instructorProfile));
    } else {
      localStorage.removeItem('velo-instructorProfile');
    }
    if (studentProfile) {
      localStorage.setItem('velo-studentProfile', JSON.stringify(studentProfile));
    } else {
      localStorage.removeItem('velo-studentProfile');
    }
  }, [screen, userRole, hasLadv, instructorProfile, studentProfile, isHydrated]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (userRole === 'student' && studentProfile?.id) {
        const lessonsRes = await getLessonsAction({ studentId: studentProfile.id });
        if (lessonsRes.success && lessonsRes.data) {
          setScheduledClasses(lessonsRes.data as ScheduledClass[]);
        }
      } else if (userRole === 'instructor' && instructorProfile?.id) {
        const lessonsRes = await getLessonsAction({ instructorId: instructorProfile.id });
        if (lessonsRes.success && lessonsRes.data) {
          setScheduledClasses(lessonsRes.data as ScheduledClass[]);
        }
      }
    };
    if (isHydrated) {
      loadInitialData();
    }
  }, [userRole, studentProfile?.id, instructorProfile?.id, isHydrated]);

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

  const login = async (credentials?: any) => {
    try {
      if (userRole === 'student') {
        const res = await loginStudentAction(credentials);
        if (res.success && res.data) {
          if (res.token) localStorage.setItem('velo-token', res.token);
          setStudentProfile(res.data as Student);
          setHasLadv(res.data.ladvUploaded);
        }
        navigateTo('student-home');
      } else {
        const res = await loginInstructorAction(credentials);
        if (res.success && res.data) {
          if (res.token) localStorage.setItem('velo-token', res.token);
          setInstructorProfile(res.data as Instructor);
        }
        navigateTo('instructor-dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (userRole === 'student') navigateTo('student-home');
      else navigateTo('instructor-dashboard');
    }
  };

  const register = async (data: any) => {
    try {
      if (userRole === 'student') {
        const res = await registerStudentAction(data);
        if (res.success && res.data) {
          if (res.token) localStorage.setItem('velo-token', res.token);
          setStudentProfile(res.data as Student);
        }
        navigateTo('student-home');
      } else {
        const res = await registerInstructorAction(data);
        if (res.success && res.data) {
          if (res.token) localStorage.setItem('velo-token', res.token);
          // Fallback missing properties for new instructor until onboarded
          setInstructorProfile({
            ...res.data,
            rating: 5.0,
            reviewsCount: 0,
            pricePerClass: 0,
            availability: [],
            busySlots: []
          });
        }
        navigateTo('instructor-dashboard');
      }
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  const logout = () => {
    setUserRole(null);
    setHasLadv(false);
    setStudentProfile(null);
    setInstructorProfile(null);
    localStorage.removeItem('velo-token');
    setScreen('onboarding');
  };

  const cancelClass = (id: string) => {
    setScheduledClasses(prev => prev.filter(c => c.id !== id));
  };

  const rateClass = async (id: string, rating: number, text: string) => {
    try {
      const result = await submitStudentFeedbackAction(id, rating, text);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c => 
          c.id === id ? { ...c, studentFeedbackRating: rating, studentFeedbackText: text } : c
        ));
      }
    } catch (err) {
      console.error('Failed to rate class:', err);
    }
  };

  const bookClass = async (date: Date, startTime: string, endTime: string, instructor: Instructor) => {
    try {
      const lessonDto = {
        studentId: studentProfile?.id || '00000000-0000-0000-0000-000000000000',
        instructorId: instructor.id,
        date: date.toISOString(),
        startTime,
        endTime,
        price: instructor.pricePerClass,
        vehicleId: instructor.vehicleId
      };
      
      const result = await createLessonAction(lessonDto);
      if (result.success && result.data) {
        setScheduledClasses(prev => [...prev, result.data as ScheduledClass]);
      } else {
        throw new Error(result.error || 'Failed to book class');
      }
    } catch (err) {
      console.error('Failed to book class:', err);
      throw err;
    }
  };

  const giveFeedback = async (id: string, feedback: string) => {
    try {
      const result = await submitInstructorFeedbackAction(id, feedback);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c => 
          c.id === id ? { ...c, instructorFeedback: feedback } : c
        ));
      }
    } catch (err) {
      console.error('Failed to give feedback:', err);
    }
  };

  const checkIn = async (id: string) => {
    try {
      const result = await checkInAction(id);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c => 
          c.id === id ? { ...c, status: 'in-progress', checkInTime: new Date() } : c
        ));
      }
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  const checkOut = async (id: string) => {
    try {
      const result = await checkOutAction(id);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c => {
          if (c.id === id) {
            const checkOutTime = new Date();
            const checkInTime = c.checkInTime || new Date();
            const durationMinutes = Math.max(1, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000));
            return { ...c, status: 'completed', checkOutTime, durationMinutes };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error('Failed to check out:', err);
    }
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
