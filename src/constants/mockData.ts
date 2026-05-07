import { Instructor, Student, ScheduledClass } from "../types";

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'i1',
    name: 'Roberto Silva',
    email: 'roberto@email.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    vehicleModel: 'Volkswagen Polo 2024',
    rating: 4.9,
    reviewsCount: 124,
    pricePerClass: 85,
    location: 'Belo Horizonte, MG',
    transmission: 'Manual',
    instructorType: 'Credenciado',
    bio: 'Especialista em alunos com medo de dirigir. Paciência e segurança em primeiro lugar.'
  },
  {
    id: 'i2',
    name: 'Ana Paula Santos',
    email: 'ana@email.com',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    vehicleModel: 'Hyundai HB20 2023',
    rating: 4.8,
    reviewsCount: 98,
    pricePerClass: 90,
    location: 'Belo Horizonte, MG',
    transmission: 'Manual',
    instructorType: 'Autônomo',
    bio: 'Aulas práticas focadas em exame de rua e baliza.'
  },
  {
    id: 'i3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    vehicleModel: 'Chevrolet Onix 2024',
    rating: 4.7,
    reviewsCount: 156,
    pricePerClass: 80,
    location: 'Contagem, MG',
    transmission: 'Automatic',
    instructorType: 'Credenciado',
    bio: 'Mais de 10 anos de experiência como instrutor credenciado pelo DETRAN-MG.'
  }
];

export const INITIAL_STUDENT_PROFILE: Student = {
  id: '',
  name: '',
  email: '',
  phone: '',
  cpf: '',
  profilePicture: '',
  ladvUploaded: false
};

export const INITIAL_SCHEDULED_CLASSES: ScheduledClass[] = [];

export const MOCK_DETRAN_STAGES = [
  { id: '1', label: 'Cadastro/RENACH', status: 'completed' as const },
  { id: '2', label: 'Exame Médico', status: 'completed' as const },
  { id: '3', label: 'Curso Teórico', status: 'current' as const },
  { id: '4', label: 'LADV & Aulas', status: 'locked' as const },
  { id: '5', label: 'Exame Final', status: 'locked' as const },
];

export const MOCK_ACADEMY_MODULES = [
  {
    id: 'm1',
    title: 'Legislação de Trânsito',
    description: 'Conheça as regras e leis que regem o trânsito brasileiro.',
    duration: '45 min',
    progress: 100,
    isLocked: false,
    questions: [
      {
        id: 'q1',
        text: 'Qual a velocidade máxima permitida em vias locais, quando não sinalizado?',
        options: [
          { id: 'A', text: '30 km/h' },
          { id: 'B', text: '40 km/h' },
          { id: 'C', text: '60 km/h' },
          { id: 'D', text: '80 km/h' }
        ],
        correctOptionId: 'A'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Direção Defensiva',
    description: 'Aprenda técnicas para evitar acidentes e dirigir com segurança.',
    duration: '60 min',
    progress: 65,
    isLocked: false,
    questions: [
      {
        id: 'q2',
        text: 'A distância de seguimento é definida como:',
        options: [
          { id: 'A', text: 'A distância que o veículo percorre após acionar os freios.' },
          { id: 'B', text: 'A distância segura entre o seu veículo e o que segue à frente.' },
          { id: 'C', text: 'A distância para ultrapassagem segura.' },
          { id: 'D', text: 'A distância total de parada.' }
        ],
        correctOptionId: 'B'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Primeiros Socorros',
    description: 'Como agir em situações de emergência no trânsito.',
    duration: '30 min',
    progress: 0,
    isLocked: false,
    questions: []
  }
];

