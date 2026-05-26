"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getJourneyState,
  getTimeline,
  declareReadyForExam,
  JourneyState,
  TimelineStep,
} from "@/lib/api/journey";

const QK = {
  state: ["journey", "me"] as const,
  timeline: ["journey", "me", "timeline"] as const,
};

function noRetryOnAuthOrNotFound(failureCount: number, error: unknown) {
  const msg = (error as Error)?.message ?? "";
  if (/unauthorized|401|404|not found/i.test(msg)) return false;
  return failureCount < 3;
}

export function useJourney() {
  return useQuery<JourneyState>({
    queryKey: QK.state,
    queryFn: getJourneyState,
    staleTime: 30_000,
    retry: noRetryOnAuthOrNotFound,
  });
}

export function useJourneyTimeline() {
  return useQuery<TimelineStep[]>({
    queryKey: QK.timeline,
    queryFn: getTimeline,
    staleTime: 30_000,
    retry: noRetryOnAuthOrNotFound,
  });
}

export function useDeclareReadyForExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: declareReadyForExam,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journey"] });
    },
  });
}

export function useInvalidateJourney() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["journey"] });
}
