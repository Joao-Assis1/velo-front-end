import { fetchWrapper, fetchBlob } from "../api-client";

type Wrapped<T> = { success: boolean; data: T; message?: string };

// === Theory course ===
export async function startTheoryCourse() {
  const res = await fetchWrapper<Wrapped<{ stage: string }>>(
    "/students/me/theory-course/start",
    { method: "POST" },
  );
  return res.data;
}

// === RENACH ===
export type RenachStatus = {
  status: "PENDING" | "SCHEDULED" | "DONE";
  renachNumber: string | null;
  biometryDoneAt: string | null;
  ufDetran: string;
};

export type RenachGuide = {
  uf: string;
  steps: string[];
};

export async function getRenachGuide(uf: string): Promise<RenachGuide> {
  const res = await fetchWrapper<Wrapped<RenachGuide>>(
    `/renach/guide?uf=${encodeURIComponent(uf)}`,
  );
  return res.data;
}

export async function getMyRenach(): Promise<RenachStatus> {
  const res = await fetchWrapper<Wrapped<RenachStatus>>("/renach/me");
  return res.data;
}

export async function submitMyRenach(payload: {
  renachNumber: string;
  ufDetran: string;
  biometryDoneAt: string;
}): Promise<RenachStatus> {
  const res = await fetchWrapper<Wrapped<RenachStatus>>("/renach/me", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

// === Medical / Psychological ===
export type ClinicExamStatus = {
  scheduledAt: string | null;
  clinicId: string | null;
  laudoUrl: string | null;
  status: "SCHEDULED" | "RESULT_UPLOADED" | "APPROVED" | "REJECTED" | null;
};

export async function getMyMedicalExam(): Promise<ClinicExamStatus> {
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>("/medical-exam/me");
  return res.data;
}

export async function scheduleMedicalExam(payload: {
  clinicId: string;
  scheduledAt: string;
}): Promise<ClinicExamStatus> {
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>(
    "/medical-exam/me/schedule",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return res.data;
}

export async function uploadMedicalLaudo(
  file: File,
  result: "APTO" | "INAPTO" | "APTO_COM_RESTRICOES",
  validUntil: Date,
): Promise<ClinicExamStatus> {
  const form = new FormData();
  form.append("file", file);
  form.append("result", result);
  form.append("validUntil", validUntil.toISOString());
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>(
    "/medical-exam/me/laudo",
    { method: "POST", body: form },
  );
  return res.data;
}

export async function downloadMedicalProtocol(): Promise<Blob> {
  return fetchBlob("/medical-exam/me/protocol/pdf");
}

export async function getMyPsychExam(): Promise<ClinicExamStatus> {
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>(
    "/psychological-exam/me",
  );
  return res.data;
}

export async function schedulePsychExam(payload: {
  clinicId: string;
  scheduledAt: string;
}): Promise<ClinicExamStatus> {
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>(
    "/psychological-exam/me/schedule",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return res.data;
}

export async function uploadPsychLaudo(
  file: File,
  result: "APTO" | "INAPTO" | "APTO_COM_RESTRICOES",
  validUntil: Date,
): Promise<ClinicExamStatus> {
  const form = new FormData();
  form.append("file", file);
  form.append("result", result);
  form.append("validUntil", validUntil.toISOString());
  const res = await fetchWrapper<Wrapped<ClinicExamStatus>>(
    "/psychological-exam/me/laudo",
    { method: "POST", body: form },
  );
  return res.data;
}

export async function downloadPsychProtocol(): Promise<Blob> {
  return fetchBlob("/psychological-exam/me/protocol/pdf");
}

// === Official theory exam ===
export type OfficialTheoryStatus = {
  declaredAt: string | null;
  proofUrl: string | null;
  approved: boolean | null;
};

export async function getMyOfficialTheory(): Promise<OfficialTheoryStatus> {
  const res = await fetchWrapper<Wrapped<OfficialTheoryStatus>>(
    "/theory-exam-official/me",
  );
  return res.data;
}

export async function declareOfficialTheory(payload: {
  approved: boolean;
  proofUrl?: string;
}): Promise<OfficialTheoryStatus> {
  const res = await fetchWrapper<Wrapped<OfficialTheoryStatus>>(
    "/theory-exam-official/me/declare",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return res.data;
}

export async function uploadOfficialTheoryProof(
  file: File,
): Promise<OfficialTheoryStatus> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetchWrapper<Wrapped<OfficialTheoryStatus>>(
    "/theory-exam-official/me/proof",
    { method: "POST", body: form },
  );
  return res.data;
}

// === LADV ===
export type LadvStatus = {
  ladvNumber: string | null;
  ladvIssuedAt: string | null;
  ladvValidUntil: string | null;
  ladvOcrStatus: "PASS" | "NEEDS_REVIEW" | "FAIL" | null;
  ladvOcrConfidence: number | null;
};

export type LadvGuide = {
  uf: string;
  steps: string[];
};

export async function getLadvGuide(uf: string): Promise<LadvGuide> {
  const res = await fetchWrapper<Wrapped<LadvGuide>>(
    `/ladv/guide?uf=${encodeURIComponent(uf)}`,
  );
  return res.data;
}

export async function getMyLadv(): Promise<LadvStatus> {
  const res = await fetchWrapper<Wrapped<LadvStatus>>("/ladv/me");
  return res.data;
}

export async function uploadLadv(file: File): Promise<LadvStatus> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetchWrapper<Wrapped<LadvStatus>>("/ladv/me/upload", {
    method: "POST",
    body: form,
  });
  return res.data;
}

export async function submitLadvManual(payload: {
  ladvNumber: string;
  ladvIssuedAt: string;
  ladvValidUntil: string;
}): Promise<LadvStatus> {
  const res = await fetchWrapper<Wrapped<LadvStatus>>("/ladv/me/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}
