import { mockGoals, mockMarks, mockMember } from "@/data/mock";
import type { Goal, Mark, Member } from "@/types";

/**
 * Phase 0 scaffolding: pages never hold their own data. Swap these resolvers for
 * real server functions in a later phase without touching component code.
 */
const latency = 220;

if (!import.meta.env.DEV) {
  throw new Error("CRITICAL: mockApi is for development only and must not be used in production.");
}

function resolve<T>(value: T): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), latency));
}

export const mockApi = {
  getGoals: (): Promise<Goal[]> => resolve(mockGoals),
  getMarks: (): Promise<Mark[]> => resolve(mockMarks),
  getMember: (): Promise<Member> => resolve(mockMember),
};

export const queryKeys = {
  goals: ["goals"] as const,
  marks: ["marks"] as const,
  member: ["member"] as const,
};
