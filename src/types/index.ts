export type UserRole = 'student' | 'instructor' | null;

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'register' 
  | 'student-home' 
  | 'student-schedule' 
  | 'student-progress' 
  | 'student-profile' 
  | 'student-settings' 
  | 'student-payments' 
  | 'student-personal-data' 
  | 'instructor-profile-view' 
  | 'instructor-dashboard' 
  | 'instructor-schedule' 
  | 'instructor-students' 
  | 'instructor-student-detail' 
  | 'instructor-profile' 
  | 'instructor-edit-profile' 
  | 'instructor-vehicle' 
  | 'instructor-availability';

export interface Availability {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startTime: string; // "08:00"
  endTime: string; // "18:00"
  isEnabled: boolean;
}

export interface BusySlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface Instructor {
  id: string;
  name: string;
  image: string;
  vehicleImage: string;
  vehicleModel: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
  bio: string;
  transmission: 'Manual' | 'Automatic';
  type: 'Credenciado' | 'Autônomo';
  // Extended details
  vehiclePlate?: string;
  vehicleYear?: string;
  availability?: Availability[];
  busySlots?: BusySlot[];
}

export interface Student {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  image: string;
}

export interface ScheduledClass {
  id: string;
  instructorId: string;
  instructorName: string;
  date: Date;
  time: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  studentFeedback?: {
    rating: number;
    text: string;
  };
  instructorFeedback?: string;
  studentName?: string;
  studentImage?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  durationMinutes?: number;
}
