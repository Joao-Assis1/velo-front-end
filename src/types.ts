export type UserRole = 'student' | 'instructor' | null;

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'register' 
  | 'student-home' 
  | 'student-progress' 
  | 'student-profile' 
  | 'instructor-profile-view' 
  | 'instructor-dashboard' 
  | 'instructor-schedule' 
  | 'instructor-students' 
  | 'instructor-profile';

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
}
