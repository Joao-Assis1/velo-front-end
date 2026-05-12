import { fetchWrapper } from "../api-client";

export async function getAcademyModulesAction() {
  try {
    // Current backend returns questions for a single simulado
    // For MVP, we'll wrap this into a single "Simulado Geral" module 
    // until the backend supports multiple modules.
    const res = await fetchWrapper<any[]>("/academy/simulado");
    
    if (!res || res.length === 0) {
      return { success: true, data: [] };
    }

    // Mapping backend Question to frontend QuizQuestion
    const mappedQuestions = res.map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((opt: string, idx: number) => ({
        id: String.fromCharCode(65 + idx), // A, B, C, D
        text: opt
      })),
      correctOptionId: String.fromCharCode(65 + q.correct)
    }));

    const modules = [
      {
        id: "m1",
        title: "Simulado Geral DETRAN",
        description: "Simulado completo com 30 questões abrangendo todos os temas.",
        duration: "45 min",
        progress: 0,
        isLocked: false,
        questions: mappedQuestions
      }
    ];

    return { success: true, data: modules };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedAcademyAction() {
  try {
    await fetchWrapper("/academy/seed", { method: "POST" });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitAcademyScoreAction(studentId: string, answers: { questionId: string; answer: number }[], startedAt: string) {
  try {
    const data = await fetchWrapper("/academy/simulado/submit", {
      method: "POST",
      body: JSON.stringify({ studentId, answers, startedAt })
    });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
