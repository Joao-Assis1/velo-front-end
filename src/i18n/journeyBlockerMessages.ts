export const journeyBlockerMessages: Record<
  string,
  { title: string; description: string; ctaLabel?: string; ctaHref?: string }
> = {
  REGISTERED: {
    title: "Termine o cadastro para começar",
    description: "Confirme seus dados pessoais antes de iniciar a journey.",
    ctaLabel: "Completar perfil",
    ctaHref: "/app/student/profile",
  },
  THEORY_COURSE_PENDING: {
    title: "Inicie o curso teórico",
    description:
      "Faça o curso EAD pelo app oficial CNH do Brasil. Depois volte e clique em 'Já comecei'.",
    ctaLabel: "Ir para curso teórico",
    ctaHref: "/app/student/theory-course",
  },
  RENACH_PENDING: {
    title: "Abra seu processo no DETRAN",
    description:
      "Compareça à unidade DETRAN-MS para abertura do RENACH e biometria.",
    ctaLabel: "Como abrir o RENACH",
    ctaHref: "/app/student/renach",
  },
  MEDICAL_PENDING: {
    title: "Exame médico pendente",
    description: "Escolha uma clínica conveniada e envie o laudo APTO.",
    ctaLabel: "Agendar exame médico",
    ctaHref: "/app/student/exams/medical",
  },
  PSYCH_PENDING: {
    title: "Exame psicológico pendente",
    description: "Escolha uma clínica conveniada e envie o laudo APTO.",
    ctaLabel: "Agendar exame psicológico",
    ctaHref: "/app/student/exams/psychological",
  },
  THEORY_EXAM_PENDING: {
    title: "Faça o exame teórico oficial no DETRAN",
    description:
      "Após aprovação, volte e declare o resultado para liberar a LADV.",
    ctaLabel: "Declarar exame teórico",
    ctaHref: "/app/student/exams/theory-official",
  },
  AWAITING_LADV_UPLOAD: {
    title: "Envie sua LADV",
    description:
      "Faça upload da Licença de Aprendizagem (LADV) emitida pelo DETRAN para liberar aulas práticas.",
    ctaLabel: "Enviar LADV",
    ctaHref: "/app/student/ladv",
  },
  LADV_EXPIRED: {
    title: "Sua LADV venceu",
    description:
      "Reemita a LADV no DETRAN-MS e faça novo upload para voltar a agendar aulas.",
    ctaLabel: "Reenviar LADV",
    ctaHref: "/app/student/ladv",
  },
  INSTRUCTOR_NOT_CREDENTIALED: {
    title: "Instrutor sem credencial DETRAN válida",
    description:
      "Selecione outro instrutor — apenas instrutores credenciados podem ministrar aulas oficiais.",
    ctaLabel: "Trocar instrutor",
    ctaHref: "/app/student/instructors",
  },
  MINIMUM_LEGAL_NOT_MET: {
    title: "Você ainda não cumpriu as 2h de aulas práticas",
    description:
      "Conclua pelo menos duas aulas com biometria completa para se declarar pronto.",
    ctaLabel: "Agendar mais aulas",
    ctaHref: "/app/student/schedule",
  },
};

export function resolveBlockerMessage(code: string) {
  return (
    journeyBlockerMessages[code] ?? {
      title: "Há uma pendência na sua jornada",
      description: code,
    }
  );
}
