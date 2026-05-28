import { fetchWrapper } from "../api-client";

export type JourneyStage =
  | "REGISTERED"
  | "THEORY_COURSE_IN_PROGRESS"
  | "RENACH_PENDING"
  | "AWAITING_LADV_UPLOAD"
  | "LADV_UPLOADED_VALID"
  | "PRACTICAL_IN_PROGRESS"
  | "READY_FOR_PRACTICAL_EXAM";

export type JourneyBlocker = {
  code: string;
  message: string;
  helpUrl?: string;
};

export type JourneyState = {
  stage: JourneyStage;
  completedSteps: JourneyStage[];
  nextStep: JourneyStage | null;
  blockers: JourneyBlocker[];
  progressPct: number;
  canScheduleLessons: boolean;
};

export type TimelineStep = {
  key: JourneyStage;
  label: string;
  status: "completed" | "in_progress" | "blocked" | "upcoming";
  helpUrl?: string;
  blockedReason?: string;
};

type Wrapped<T> = { success: boolean; data: T; message?: string };

export async function getJourneyState(): Promise<JourneyState> {
  const res = await fetchWrapper<Wrapped<JourneyState>>("/journey/me");
  return res.data;
}

export async function getTimeline(): Promise<TimelineStep[]> {
  const res = await fetchWrapper<Wrapped<TimelineStep[]>>("/journey/me/timeline");
  return (res.data ?? []).map((s) => ({
    ...s,
    status: (s.status === ("locked" as string) ? "upcoming" : s.status) as TimelineStep["status"],
  }));
}

export async function declareReadyForExam(): Promise<JourneyState> {
  const res = await fetchWrapper<Wrapped<JourneyState>>(
    "/journey/me/declare-ready-for-exam",
    { method: "POST" },
  );
  return res.data;
}

export async function subscribeToPush(
  subscription: PushSubscriptionJSON,
): Promise<void> {
  await fetchWrapper<Wrapped<unknown>>("/push/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
}
