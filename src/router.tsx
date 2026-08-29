import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { routeTree } from "./routeTree.gen";
import type { MemberProfile } from "./types";

export interface RouterContext {
  queryClient: QueryClient;
  /** Authenticated user from the server-side session. Null when unauthenticated. */
  user: User | null;
  /** Authenticated user's profile from the database. Null when unauthenticated or not found. */
  profile: MemberProfile | null;
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, user: null, profile: null } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
