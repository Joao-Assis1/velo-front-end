import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Screen, UserRole } from '../types';

interface AppContextType {
  screen: Screen;
  userRole: UserRole;
  selectedInstructorId: string | null;
  hasLadv: boolean;
  navigateTo: (screen: Screen) => void;
  setUserRole: (role: UserRole) => void;
  selectInstructor: (id: string) => void;
  setHasLadv: (status: boolean) => void;
  login: () => void;
  register: (ladvUploaded?: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [hasLadv, setHasLadv] = useState(false);

  const navigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
    window.scrollTo(0, 0);
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

  return (
    <AppContext.Provider
      value={{
        screen,
        userRole,
        selectedInstructorId,
        hasLadv,
        navigateTo,
        setUserRole,
        selectInstructor,
        setHasLadv,
        login,
        register,
        logout,
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
