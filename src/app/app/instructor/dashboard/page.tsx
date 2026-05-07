"use client";

import React from 'react';
import { InstructorDashboard } from '@/components/screens/instructor/Dashboard';
import { useApp } from '@/context/AppContext';

export default function InstructorDashboardPage() {
  const { 
    instructorProfile, 
    scheduledClasses, 
    navigateTo, 
    giveFeedback 
  } = useApp();

  return (
    <InstructorDashboard 
      profile={instructorProfile}
      classes={scheduledClasses}
      onViewSchedule={() => navigateTo('instructor-schedule')}
      onGiveFeedback={giveFeedback}
    />
  );
}
