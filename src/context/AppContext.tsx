"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, Instructor, Student, ScheduledClass, DetranStage, AcademyModule } from '../types';
import {
  createLessonAction,
  cancelLessonAction,
  checkInAction,
  checkOutAction,
  submitStudentFeedbackAction,
  submitInstructorFeedbackAction,
  getLessonsAction,
  acceptLessonAction,
  rejectLessonAction
} from '@/lib/actions/lessons';
import { 
  loginStudentAction, 
  loginInstructorAction,
  registerStudentAction,
  registerInstructorAction
} from '@/lib/actions/auth';
import { updateInstructorProfileAction } from '@/lib/actions/instructors';
import { updateStudentProfileAction } from '@/lib/actions/profileActions';
import { getAcademyModulesAction, seedAcademyAction } from '@/lib/actions/academy';
import { INITIAL_STUDENT_PROFILE } from '../constants/mockData';

interface AppContextType {
  userRole: UserRole;
  hasLadv: boolean;
  hasPaymentMethod: boolean;
  instructorProfile: Instructor | null;
  studentProfile: Student | null;
  scheduledClasses: ScheduledClass[];
  busySlots: Record<string, string[]>;
  detranStages: DetranStage[];
  academyModules: AcademyModule[];
  availableBalance: number;
  pendingBalance: number;
  activeClassId: string | null;
  
  // Actions
  setUserRole: (role: UserRole) => void;
  setHasLadv: (status: boolean) => void;
  setInstructorProfile: (profile: Instructor | null) => void;
  setStudentProfile: (profile: Student | null) => void;
  setScheduledClasses: (classes: ScheduledClass[]) => void;
  setBusySlots: (slots: Record<string, string[]>) => void;
  setDetranStages: (stages: DetranStage[]) => void;
  setAcademyModules: React.Dispatch<React.SetStateAction<AcademyModule[]>>;
  setActiveClassId: (id: string | null) => void;
  
  login: (credentials?: any, forcedRole?: UserRole) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateStudentProfile: (data: any) => Promise<void>;
  updateInstructorProfile: (data: any) => Promise<void>;
  logout: () => void;
  
  // Business logic
  cancelClass: (id: string) => Promise<void>;
  rateClass: (id: string, rating: number, text: string) => void;
  bookClass: (date: Date, startTime: string, endTime: string, instructor: Instructor) => void;
  giveFeedback: (id: string, feedback: string) => void;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  startClass: (id: string) => void;
  acceptLesson: (id: string) => Promise<void>;
  rejectLesson: (id: string) => Promise<void>;
  finishClass: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [hasLadv, setHasLadv] = useState(false);
  const [instructorProfile, setInstructorProfile] = useState<Instructor | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);
  const [busySlots, setBusySlots] = useState<Record<string, string[]>>({});
  const [detranStages, setDetranStages] = useState<DetranStage[]>([]);
  const [academyModules, setAcademyModules] = useState<AcademyModule[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const persistedUserRole = localStorage.getItem('velo-userRole');
      const persistedInstructorProfile = localStorage.getItem('velo-instructorProfile');
      const persistedStudentProfile = localStorage.getItem('velo-studentProfile');
      const persistedHasLadv = localStorage.getItem('velo-hasLadv');

      if (persistedUserRole) {
        const parsedData = JSON.parse(persistedUserRole);
        if (parsedData === 'student' || parsedData === 'instructor') {
          setUserRole(parsedData);
        }
      }
      
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
  }, [userRole, hasLadv, instructorProfile, studentProfile, isHydrated]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (userRole === 'student' && studentProfile?.id) {
        // Fetch Lessons
        const lessonsRes = await getLessonsAction({ studentId: studentProfile.id });
        if (lessonsRes.success && lessonsRes.data) {
          setScheduledClasses(lessonsRes.data as ScheduledClass[]);
        }

        // Fetch Academy Modules
        let academyRes = await getAcademyModulesAction();
        if (academyRes.success) {
          if (!academyRes.data || academyRes.data.length === 0) {
            // Auto-seed if empty
            await seedAcademyAction();
            academyRes = await getAcademyModulesAction();
          }
          if (academyRes.data) {
            setAcademyModules(academyRes.data as AcademyModule[]);
          }
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

  const login = async (credentials?: any, forcedRole?: UserRole) => {
    const roleToUse = forcedRole || userRole;
    if (roleToUse === 'student') {
      const res = await loginStudentAction(credentials);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Credenciais inválidas');
      }
      if (res.token) {
        localStorage.setItem('velo-token', res.token);
        document.cookie = `velo-token=${res.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      setUserRole('student');
      setStudentProfile(res.data as Student);
      setHasLadv((res.data as any).ladvUploaded ?? false);
    } else {
      const res = await loginInstructorAction(credentials);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Credenciais inválidas');
      }
      if (res.token) {
        localStorage.setItem('velo-token', res.token);
        document.cookie = `velo-token=${res.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      setUserRole('instructor');
      setInstructorProfile(res.data as Instructor);
    }
  };

  const register = async (data: any) => {
    if (userRole === 'student') {
      const res = await registerStudentAction(data);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Erro ao realizar cadastro');
      }
      if (res.token) {
        localStorage.setItem('velo-token', res.token);
        document.cookie = `velo-token=${res.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      setStudentProfile(res.data as Student);
    } else {
      const res = await registerInstructorAction(data);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Erro ao realizar cadastro');
      }
      if (res.token) {
        localStorage.setItem('velo-token', res.token);
        document.cookie = `velo-token=${res.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      setInstructorProfile({
        ...res.data,
        rating: res.data.rating ?? 5.0,
        reviewsCount: res.data.reviewsCount ?? 0,
        pricePerClass: res.data.pricePerClass ?? 0,
        availability: res.data.availability ?? [],
        busySlots: res.data.busySlots ?? [],
      });
    }
  };

  const updateStudentProfile = async (data: any) => {
    if (!studentProfile?.id) return;
    try {
      // Filtrar campos que o backend pode não aceitar ainda (whitelist)
      const { 
        id, email, cpf, termsAcceptedAt, birthDate, motherName, 
        intendedCategory, ufDomicile, ...updateData 
      } = data;

      const res = await updateStudentProfileAction(studentProfile.id, {
        ...updateData,
        // Incluir novos campos se o backend permitir, senão eles serão ignorados pelo interceptor
        birthDate,
        motherName,
        intendedCategory,
        ufDomicile
      });

      if (res.success) {
        setStudentProfile((prev) => (prev ? { ...prev, ...data } : null));
      } else {
        // Se falhar por campos extras, tentamos enviar sem eles para não quebrar o app
        console.warn("Retrying profile update without CONTRAN fields due to backend restriction");
        const retryRes = await updateStudentProfileAction(studentProfile.id, updateData);
        if (retryRes.success) {
          setStudentProfile((prev) => (prev ? { ...prev, ...data } : null));
        } else {
          throw new Error(retryRes.error || res.error);
        }
      }
    } catch (err: any) {
      console.error("Failed to update student profile:", err);
      throw err;
    }
  };

  const updateInstructorProfile = async (data: any) => {
    if (!instructorProfile?.id) return;
    try {
      const {
        id, email, rating, reviewsCount, availability, busySlots,
        vehicleId, vehicleModel, vehiclePlate, vehicleYear, transmission,
        instructorType, birthDate, renachNumber, educationLevel, ...updateData
      } = data;

      if (updateData.certidaoNegativa !== undefined) {
        updateData.certidaoNegativa = String(updateData.certidaoNegativa);
      }

      const res = await updateInstructorProfileAction(instructorProfile.id, {
        ...updateData,
        birthDate,
        renachNumber,
        educationLevel,
      });

      if (res.success) {
        setInstructorProfile((prev) => (prev ? { ...prev, ...data } : null));
      } else {
        console.warn("Retrying instructor profile update without CONTRAN fields");
        const retryRes = await updateInstructorProfileAction(instructorProfile.id, updateData);
        if (retryRes.success) {
          setInstructorProfile((prev) => (prev ? { ...prev, ...data } : null));
        } else {
          throw new Error(retryRes.error || res.error);
        }
      }
    } catch (err: any) {
      console.error("Failed to update instructor profile:", err);
      throw err;
    }
  };

  const logout = () => {
    setUserRole(null);
    setHasLadv(false);
    setStudentProfile(null);
    setInstructorProfile(null);
    localStorage.removeItem('velo-token');
    document.cookie = "velo-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const cancelClass = async (id: string) => {
    const result = await cancelLessonAction(id);
    if (result.success) {
      setScheduledClasses(prev => prev.filter(c => c.id !== id));
    } else {
      throw new Error(result.error || 'Não foi possível cancelar a aula');
    }
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
      const defaultPM = (studentProfile as any)?.paymentMethods?.find(
        (pm: any) => pm.isDefault && !pm.isDeleted
      );
      if (!defaultPM && instructor.pricePerClass) {
        throw new Error('Nenhum cartão padrão cadastrado. Adicione um cartão antes de agendar.');
      }

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
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to book class');
      }

      const lesson = result.data as ScheduledClass;
      setScheduledClasses(prev => [...prev, lesson]);
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

  const startClass = (id: string) => {
    setScheduledClasses(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'in-progress', checkInTime: new Date() } : c
    ));
    setActiveClassId(id);
  };

  const finishClass = (id: string) => {
    setScheduledClasses(prev => prev.map(c => {
      if (c.id === id) {
        const checkOutTime = new Date();
        const checkInTime = c.checkInTime || new Date();
        const durationMinutes = Math.max(1, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000));
        
        return { ...c, status: 'completed', checkOutTime, durationMinutes };
      }
      return c;
    }));
    setActiveClassId(null);
  };

  const acceptLesson = async (id: string) => {
    try {
      const result = await acceptLessonAction(id);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'upcoming' } : c
        ));
      } else {
        throw new Error(result.error || 'Não foi possível aceitar a aula');
      }
    } catch (err) {
      console.error('Failed to accept lesson:', err);
      throw err;
    }
  };

  const rejectLesson = async (id: string) => {
    try {
      const result = await rejectLessonAction(id);
      if (result.success) {
        setScheduledClasses(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'cancelled' } : c
        ));
      } else {
        throw new Error(result.error || 'Não foi possível recusar a aula');
      }
    } catch (err) {
      console.error('Failed to reject lesson:', err);
      throw err;
    }
  };

  const hasPaymentMethod = (studentProfile?.paymentMethods?.length ?? 0) > 0;

  return (
    <AppContext.Provider
      value={{
        userRole,
        hasLadv,
        hasPaymentMethod,
        instructorProfile,
        studentProfile,
        scheduledClasses,
        busySlots,
        detranStages,
        academyModules,
        availableBalance,
        pendingBalance,
        activeClassId,
        setUserRole,
        setHasLadv,
        setInstructorProfile,
        setStudentProfile,
        setScheduledClasses,
        setBusySlots,
        setDetranStages,
        setAcademyModules,
        setActiveClassId,
        login,
        register,
        updateStudentProfile,
        updateInstructorProfile,
        logout,
        cancelClass,
        rateClass,
        bookClass,
        giveFeedback,
        checkIn,
        checkOut,
        startClass,
        finishClass,
        acceptLesson,
        rejectLesson
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
