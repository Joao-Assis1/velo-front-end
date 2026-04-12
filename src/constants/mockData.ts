import { Instructor, Student, ScheduledClass } from "../types";

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    vehicleModel: 'Hyundai HB20 (2023)',
    rating: 4.9,
    reviews: 124,
    price: 60,
    location: 'Centro, São Paulo',
    bio: 'Instrutor credenciado há 10 anos. Especialista em baliza e direção defensiva. Paciente e didático.',
    transmission: 'Manual',
    type: 'Credenciado',
    vehiclePlate: 'ABC-1234',
    vehicleYear: '2023',
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isEnabled: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isEnabled: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isEnabled: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isEnabled: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isEnabled: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', isEnabled: true },
      { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isEnabled: false },
    ],
    busySlots: []
  },
  {
    id: '2',
    name: 'Fernanda Oliveira',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    vehicleModel: 'Honda City (Automatic)',
    rating: 5.0,
    reviews: 89,
    price: 75,
    location: 'Vila Mariana, São Paulo',
    bio: 'Aulas focadas em quem tem medo de dirigir. Metodologia calma e progressiva.',
    transmission: 'Automatic',
    type: 'Autônomo',
    vehiclePlate: 'XYZ-9876',
    vehicleYear: '2022'
  },
  {
    id: '3',
    name: 'Roberto Santos',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop',
    vehicleModel: 'Chevrolet Onix',
    rating: 4.7,
    reviews: 56,
    price: 55,
    location: 'Pinheiros, São Paulo',
    bio: 'Instrutor jovem e dinâmico. Horários flexíveis inclusive aos finais de semana.',
    transmission: 'Manual',
    type: 'Credenciado',
    vehiclePlate: 'DEF-5678',
    vehicleYear: '2021'
  },
  {
    id: '4',
    name: 'Juliana Lima',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    vehicleModel: 'Volkswagen Polo',
    rating: 4.8,
    reviews: 42,
    price: 65,
    location: 'Moema, São Paulo',
    bio: 'Especialista em trânsito pesado e rodovias. Aulas práticas e seguras.',
    transmission: 'Manual',
    type: 'Autônomo',
    vehiclePlate: 'GHI-1234',
    vehicleYear: '2022'
  },
  {
    id: '5',
    name: 'Ricardo Alves',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
    vehicleModel: 'Toyota Corolla',
    rating: 4.6,
    reviews: 31,
    price: 90,
    location: 'Itaim Bibi, São Paulo',
    bio: 'Foco em direção executiva e conforto. Veículo premium para melhor aprendizado.',
    transmission: 'Automatic',
    type: 'Credenciado',
    vehiclePlate: 'JKL-5678',
    vehicleYear: '2023'
  },
  {
    id: '6',
    name: 'Beatriz Costa',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    vehicleImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
    vehicleModel: 'Fiat Argo',
    rating: 4.9,
    reviews: 75,
    price: 50,
    location: 'Santana, São Paulo',
    bio: 'Aulas econômicas e eficientes. Ótima taxa de aprovação dos alunos.',
    transmission: 'Manual',
    type: 'Autônomo',
    vehiclePlate: 'MNO-9012',
    vehicleYear: '2021'
  }
];

export const INITIAL_STUDENT_PROFILE: Student = {
  name: 'Gabriel Silva',
  email: 'gabriel@email.com',
  phone: '(11) 99999-9999',
  cpf: '000.000.000-00',
  image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop'
};

export const INITIAL_SCHEDULED_CLASSES: ScheduledClass[] = [
  {
    id: 'mock-1',
    instructorId: '1',
    instructorName: 'Carlos Silva',
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    time: '14:00',
    status: 'completed',
    price: 60,
    instructorFeedback: 'Ótimo controle de embreagem, mas precisa melhorar a atenção nos retrovisores.',
    studentName: 'Gabriel Silva',
    studentImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop'
  },
  {
    id: 'mock-2',
    instructorId: '1',
    instructorName: 'Carlos Silva',
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    time: '10:00',
    status: 'completed',
    price: 60,
    instructorFeedback: 'Evoluiu bastante na baliza. Parabéns!',
    studentName: 'Gabriel Silva',
    studentImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop'
  },
  {
    id: 'mock-3',
    instructorId: '2',
    instructorName: 'Ana Souza',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '09:00',
    status: 'upcoming',
    price: 65,
    studentName: 'Gabriel Silva',
    studentImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop'
  }
];
