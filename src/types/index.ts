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
  | 'instructor-availability'
  | 'instructor-finance'
  | 'instructor-settings';

export interface Availability {
  id?: string;
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
  email: string;
  name: string;
  profilePicture?: string;
  vehicleImage?: string;
  vehicleModel?: string;
  rating: number;
  reviewsCount: number;
  pricePerClass?: number;
  location?: string;
  bio?: string;
  transmission?: 'Manual' | 'Automatic';
  instructorType?: 'Credenciado' | 'Autônomo';
  // Extended details
  vehicleId?: string;
  vehiclePlate?: string;
  vehicleYear?: string;
  availability?: Availability[];
  busySlots?: BusySlot[];
  // CONTRAN 1.020/2025
  birthDate?: Date;
  cnhNumber?: string;
  cnhCategory?: string;
  cnhEar?: boolean;
  educationLevel?: string;
  renachNumber?: string;
  certidaoNegativa?: boolean;
  isActive?: boolean;
  cnhExpiry?: Date;
  hasDoubleCommand?: boolean;
}

export interface Student {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  profilePicture?: string;
  ladvUploaded: boolean;
  ladvValidationDate?: Date;
  ladvDocumentUrl?: string;
  paymentMethods?: PaymentMethod[];
  // CONTRAN 1.020/2025
  birthDate?: Date;
  motherName?: string;
  intendedCategory?: 'A' | 'B' | 'ACC' | 'AB';
  ufDomicile?: string;
  checklist?: {
    medico: boolean;
    psicotecnico: boolean;
    teorico: boolean;
    pratico: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  studentId: string;
  last4: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface ScheduledClass {
  id: string;
  studentId: string;
  instructorId: string;
  instructorName?: string;
  vehicleId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  price?: number;
  studentFeedbackRating?: number;
  studentFeedbackText?: string;
  instructorFeedback?: string;
  studentName?: string;
  studentImage?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  durationMinutes?: number;
}

export interface DetranStage {
  id: string;
  label: string;
  status: 'locked' | 'current' | 'completed';
  iconName?: string;
}

export interface InstructorFilter {
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  days?: string[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number; // 0-100
  isLocked: boolean;
  videoUrl?: string;
  questions?: QuizQuestion[];
}

export type EscrowStatus = 'LOCKED' | 'IN_PROGRESS' | 'RELEASED' | 'UNDER_ANALYSIS';

export interface LessonEscrow {
  status: EscrowStatus;
  amount: number;
  fee: number;
  netAmount: number;
}

export type BiometryStage = 'START' | 'MID' | 'END';
