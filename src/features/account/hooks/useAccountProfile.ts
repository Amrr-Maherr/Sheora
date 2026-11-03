"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getStoredUserRaw,
  subscribeToAuth,
} from "@/lib/authStorage";
import type { User } from "@/types";
import {
  DEMO_ACCOUNT_PROFILE,
  buildAccountProfile,
  type AccountProfile,
} from "../lib/accountProfile";

export function useAccountProfile(): AccountProfile {
  const rawUser = useSyncExternalStore(
    subscribeToAuth,
    getStoredUserRaw,
    () => null,
  );

  return useMemo(() => {
    if (!rawUser) {
      return DEMO_ACCOUNT_PROFILE;
    }

    try {
      return buildAccountProfile(JSON.parse(rawUser) as User);
    } catch {
      return DEMO_ACCOUNT_PROFILE;
    }
  }, [rawUser]);
}
