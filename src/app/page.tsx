"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';

// Auth Screens
import { SplashScreen } from '@/components/screens/auth/SplashScreen';
import { Onboarding } from '@/components/screens/auth/Onboarding';
import { Login } from '@/components/screens/auth/Login';
import { Register } from '@/components/screens/auth/Register';

// Student Screens
import { StudentHome } from '@/components/screens/student/Home';
import { StudentSchedule } from '@/components/screens/student/Schedule';
import { StudentProgress } from '@/components/screens/student/Progress';
import { StudentProfile } from '@/components/screens/student/Profile';
import { StudentPersonalData } from '@/components/screens/student/PersonalData';
import { InstructorProfileView } from '@/components/screens/student/InstructorProfile';

// Instructor Screens
import { InstructorDashboard } from '@/components/screens/instructor/Dashboard';
import { InstructorSchedule } from '@/components/screens/instructor/Schedule';
import { InstructorProfileMenu } from '@/components/screens/instructor/ProfileMenu';
import { InstructorEditProfile } from '@/components/screens/instructor/EditProfile';
import { InstructorVehicle } from '@/components/screens/instructor/Vehicle';
import { InstructorAvailability } from '@/components/screens/instructor/Availability';

// Navigation
import { Tabs } from '@/components/navigation/Tabs';
import { cn } from '@/lib/utils';

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
      case 'student-personal-data':
        return (
          <StudentPersonalData 
            profile={studentProfile} 
            onSave={setStudentProfile} 
            onBack={() => navigateTo('student-profile')}
          />
        );
      case 'instructor-profile-view':
        return selectedInstructorId ? (
          <InstructorProfileView 
            instructorId={selectedInstructorId} 
            onBack={() => navigateTo('student-home')} 
            hasLadv={hasLadv}
            onUploadLadv={() => setHasLadv(true)}
            onBookClass={bookClass}
            busySlots={busySlots}
          />
        ) : null;

      // Instructor Screens
      case 'instructor-dashboard':
        return (
          <InstructorDashboard 
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
      showNav ? "max-w-md mx-auto shadow-2xl md:max-w-full md:mx-0 md:shadow-none md:pl-64" : "max-w-md mx-auto shadow-2xl md:max-w-lg"
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
          <div className={showNav ? "md:max-w-5xl md:mx-auto" : ""}>
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
