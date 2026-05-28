import { fetchWrapper } from "../api-client";

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
