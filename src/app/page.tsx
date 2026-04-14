"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { MOCK_INSTRUCTORS } from '@/constants/mockData';

import dynamic from 'next/dynamic';

// Auth Screens
const SplashScreen = dynamic(() => import('@/components/screens/auth/SplashScreen').then(mod => ({ default: mod.SplashScreen })));
const Onboarding = dynamic(() => import('@/components/screens/auth/Onboarding').then(mod => ({ default: mod.Onboarding })));
const Login = dynamic(() => import('@/components/screens/auth/Login').then(mod => ({ default: mod.Login })));
const Register = dynamic(() => import('@/components/screens/auth/Register').then(mod => ({ default: mod.Register })));

// Student Screens
const StudentHome = dynamic(() => import('@/components/screens/student/Home').then(mod => ({ default: mod.StudentHome })));
const StudentSchedule = dynamic(() => import('@/components/screens/student/Schedule').then(mod => ({ default: mod.StudentSchedule })));
const StudentProgress = dynamic(() => import('@/components/screens/student/Progress').then(mod => ({ default: mod.StudentProgress })));
const StudentProfile = dynamic(() => import('@/components/screens/student/Profile').then(mod => ({ default: mod.StudentProfile })));
const StudentPersonalData = dynamic(() => import('@/components/screens/student/PersonalData').then(mod => ({ default: mod.StudentPersonalData })));
const InstructorProfileView = dynamic(() => import('@/components/screens/student/InstructorProfile').then(mod => ({ default: mod.InstructorProfileView })));
const StudentSettings = dynamic(() => import('@/components/screens/student/Settings').then(mod => ({ default: mod.StudentSettings })));
const StudentPayments = dynamic(() => import('@/components/screens/student/Payments').then(mod => ({ default: mod.StudentPayments })));

// Instructor Screens
const InstructorDashboard = dynamic(() => import('@/components/screens/instructor/Dashboard').then(mod => ({ default: mod.InstructorDashboard })));
const InstructorSchedule = dynamic(() => import('@/components/screens/instructor/Schedule').then(mod => ({ default: mod.InstructorSchedule })));
const InstructorProfileMenu = dynamic(() => import('@/components/screens/instructor/ProfileMenu').then(mod => ({ default: mod.InstructorProfileMenu })));
const InstructorEditProfile = dynamic(() => import('@/components/screens/instructor/EditProfile').then(mod => ({ default: mod.InstructorEditProfile })));
const InstructorVehicle = dynamic(() => import('@/components/screens/instructor/Vehicle').then(mod => ({ default: mod.InstructorVehicle })));
const InstructorAvailability = dynamic(() => import('@/components/screens/instructor/Availability').then(mod => ({ default: mod.InstructorAvailability })));
const InstructorFinance = dynamic(() => import('@/components/screens/instructor/Finance').then(mod => ({ default: mod.InstructorFinance })));
const InstructorSettings = dynamic(() => import('@/components/screens/instructor/Settings').then(mod => ({ default: mod.InstructorSettings })));

// Navigation
import { Tabs } from '@/components/navigation/Tabs';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getInstructorsAction } from '@/lib/actions/instructors';
import { Instructor } from '@/types';

export default function Page() {
  const { 
    screen, 
    userRole, 
    navigateTo, 
    setUserRole, 
    login, 
    register, 
    logout,
    selectedInstructorId,
    selectInstructor,
    hasLadv,
    setHasLadv,
    scheduledClasses,
    cancelClass,
    rateClass,
    bookClass,
    instructorProfile,
    studentProfile,
    setInstructorProfile,
    setStudentProfile,
    giveFeedback,
    checkIn,
    checkOut,
    busySlots
  } = useApp();

  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await getInstructorsAction();
      if (response.success) return response.data as Instructor[];
      return [];
    }
  });

  const renderContent = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onFinish={() => navigateTo('onboarding')} />;
      case 'onboarding':
        return (
          <Onboarding 
            onSelectRole={(role) => {
              setUserRole(role);
              navigateTo('auth');
            }} 
          />
        );
      case 'auth':
        return (
          <Login 
            role={userRole} 
            onLogin={login} 
            onRegister={() => navigateTo('register')} 
            onBack={() => {
              setUserRole(null);
              navigateTo('onboarding');
            }} 
          />
        );
      case 'register':
        return (
          <Register 
            role={userRole} 
            onRegister={register} 
            onBack={() => navigateTo('auth')} 
          />
        );
      
      // Student Screens
      case 'student-home':
        return <StudentHome onSelectInstructor={selectInstructor} />;
      case 'student-schedule':
        return (
          <StudentSchedule 
            classes={scheduledClasses} 
            onCancelClass={cancelClass} 
            onRateClass={rateClass} 
          />
        );
      case 'student-progress':
        return <StudentProgress classes={scheduledClasses} />;
      case 'student-profile':
        return (
          <StudentProfile 
            profile={studentProfile} 
            onNavigate={navigateTo} 
            onLogout={logout} 
          />
        );
      case 'student-payments':
        return <StudentPayments onBack={() => navigateTo('student-profile')} />;
      case 'student-settings':
        return <StudentSettings onBack={() => navigateTo('student-profile')} />;
      case 'student-personal-data':
        return (
          <StudentPersonalData 
            profile={studentProfile} 
            onSave={setStudentProfile} 
            onBack={() => navigateTo('student-profile')}
          />
        );
      case 'instructor-profile-view':
        const selectedInstructor = instructors.find(i => i.id === selectedInstructorId) || 
                                    (scheduledClasses.find(c => c.instructorId === selectedInstructorId) as any);
        return (
          <InstructorProfileView 
            instructor={selectedInstructor}
            onBack={() => navigateTo('student-home')} 
            hasLadv={hasLadv}
            onUploadLadv={() => setHasLadv(true)}
            onBookClass={bookClass}
            busySlots={busySlots}
          />
        );

      // Instructor Screens
      case 'instructor-dashboard':
        return (
          <InstructorDashboard 
            profile={instructorProfile}
            onViewSchedule={() => navigateTo('instructor-schedule')} 
            classes={scheduledClasses} 
            onGiveFeedback={giveFeedback} 
          />
        );
      case 'instructor-schedule':
        return (
          <InstructorSchedule 
            classes={scheduledClasses} 
            onGiveFeedback={giveFeedback} 
            onCheckIn={checkIn} 
            onCheckOut={checkOut} 
            onNavigate={navigateTo}
          />
        );
      case 'instructor-profile':
        return (
          <InstructorProfileMenu 
            profile={instructorProfile} 
            onNavigate={navigateTo} 
            onLogout={logout} 
          />
        );
      case 'instructor-edit-profile':
        return (
          <InstructorEditProfile 
            profile={instructorProfile} 
            onSave={setInstructorProfile} 
            onBack={() => navigateTo('instructor-profile')}
          />
        );
      case 'instructor-vehicle':
        return (
          <InstructorVehicle 
            profile={instructorProfile} 
            onSave={setInstructorProfile} 
            onBack={() => navigateTo('instructor-profile')}
          />
        );
      case 'instructor-availability':
        return (
          <InstructorAvailability 
            profile={instructorProfile} 
            onSave={setInstructorProfile}
            onBack={() => navigateTo('instructor-schedule')}
          />
        );
      case 'instructor-finance':
        return (
          <InstructorFinance 
            classes={scheduledClasses} 
            onBack={() => navigateTo('instructor-profile')}
          />
        );
      case 'instructor-settings':
        return (
          <InstructorSettings 
            onBack={() => navigateTo('instructor-profile')}
          />
        );
      
      default:
        return <div className="p-8 text-center">Screen "{screen}" not implemented yet.</div>;
    }
  };

  const showNav = ![
    'splash', 'onboarding', 'auth', 'register'
  ].includes(screen);

  return (
    <main className={cn(
      "bg-slate-50 min-h-screen font-sans relative overflow-x-hidden",
      showNav ? "w-full md:pl-64" : "w-full max-w-lg mx-auto md:max-w-xl"
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          <div className={showNav ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : "px-4 py-12"}>
            {renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <Tabs 
          currentScreen={screen} 
          userRole={userRole} 
          onNavigate={navigateTo} 
        />
      )}
    </main>
  );
}
