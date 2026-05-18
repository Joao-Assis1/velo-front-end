import { z } from "zod";

export const AvailabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isEnabled: z.boolean(),
});

export const BusySlotSchema = z.object({
  id: z.string().uuid(),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string().optional(),
});

export const InstructorSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().url().optional(),
  vehicleImage: z.string().url().optional(),
  vehicleModel: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewsCount: z.number().int().nonnegative().default(0),
  pricePerClass: z.number().positive().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  transmission: z.enum(["Manual", "Automatic"]).optional(),
  instructorType: z.enum(["Credenciado", "Autônomo"]).optional(),
  vehiclePlate: z.string().optional(),
  vehicleYear: z.string().optional(),
  availability: z.array(AvailabilitySchema).optional(),
  busySlots: z.array(BusySlotSchema).optional(),
  // CONTRAN 1.020/2025
  birthDate: z.coerce.date().optional(),
  cnhNumber: z.string().optional(),
  cnhCategory: z.string().optional(),
  cnhEar: z.boolean().optional(),
  educationLevel: z.string().optional(),
  renachNumber: z.string().optional(),
  certidaoNegativa: z.string().optional(),
  noGravissima: z.boolean().optional(),
  hasInstructorCourse: z.boolean().optional(),
  noCassacao: z.boolean().optional(),
  hasDoubleCommand: z.boolean().optional(),
  termsAcceptedAt: z.coerce.date().optional(),
});

export const StudentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  profilePicture: z.string().url().optional(),
  ladvUploaded: z.boolean().default(false),
  // CONTRAN 1.020/2025
  birthDate: z.coerce.date().optional(),
  motherName: z.string().optional(),
  intendedCategory: z.enum(["A", "B", "ACC", "AB"]).optional(),
  ufDomicile: z.string().optional(),
  termsAcceptedAt: z.coerce.date().optional(),
});

export const CreateStudentSchema = StudentSchema.omit({ id: true });

export const LessonSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  instructorId: z.string(),
  instructorName: z.string().optional(),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["pending_acceptance", "upcoming", "in-progress", "completed", "cancelled"]),
  price: z.number().positive().optional(),
  studentFeedbackRating: z.number().min(0).max(5).optional(),
  studentFeedbackText: z.string().optional(),
  instructorFeedback: z.string().optional(),
  studentName: z.string().optional(),
  studentImage: z.string().optional(),
  checkInTime: z.coerce.date().optional(),
  checkOutTime: z.coerce.date().optional(),
  durationMinutes: z.number().optional(),
  disputeOpened: z.boolean().optional(),
  disputeReason: z.string().optional(),
  paymentReleased: z.boolean().optional(),
});

export const CreateLessonSchema = z.object({
  studentId: z.string().uuid(),
  instructorId: z.string(),
  vehicleId: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  price: z.number().positive().optional(),
});

export type InstructorType = z.infer<typeof InstructorSchema>;
export type StudentType = z.infer<typeof StudentSchema>;
export type CreateStudentDto = z.infer<typeof CreateStudentSchema>;
export type LessonType = z.infer<typeof LessonSchema>;
export type CreateLessonDto = z.infer<typeof CreateLessonSchema>;
