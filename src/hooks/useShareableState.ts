"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * URL search-param keys for the wealth calculator state.
 * Short keys keep shareable URLs compact.
 */
const PARAM_KEYS = {
  mode: "m", // "w" (wealth) | "i" (income)
  amount: "a", // integer in local currency, no separators
  age: "g", // integer 18-120
} as const;

export type ShareableMode = "wealth" | "income";

export interface ShareableState {
  readonly mode: ShareableMode;
  readonly amount: string; // raw input string (digits, optional leading minus for wealth)
  readonly age: string;
}

const EMPTY_STATE: ShareableState = {
  mode: "wealth",
  amount: "",
  age: "",
};

/**
 * Parse the current URL's search params into a `ShareableState`.
 * Returns `EMPTY_STATE` when running on the server or when params are absent.
 */
export function readShareableStateFromUrl(): ShareableState {
  if (typeof window === "undefined") return EMPTY_STATE;

  const sp = new URLSearchParams(window.location.search);
  const modeParam = sp.get(PARAM_KEYS.mode);
  const amountParam = sp.get(PARAM_KEYS.amount);
  const ageParam = sp.get(PARAM_KEYS.age);

  const mode: ShareableMode = modeParam === "i" ? "income" : "wealth";

  // Amount: accept digits, allow leading minus only for wealth mode
  let amount = "";
  if (amountParam) {
    const cleaned =
      mode === "wealth"
        ? amountParam.replace(/(?!^-)[^0-9]/g, "")
        : amountParam.replace(/[^0-9]/g, "");
    if (cleaned.length > 0 && cleaned !== "-") {
      amount = cleaned;
    }
  }

  // Age: integer 18-120
  let age = "";
  if (ageParam) {
    const n = parseInt(ageParam.replace(/[^0-9]/g, ""), 10);
    if (Number.isFinite(n) && n >= 18 && n <= 120) {
      age = String(n);
    }
  }

  return { mode, amount, age };
}

/**
 * Build a URL search-param string from a `ShareableState`.
 * Empty values are omitted to keep the URL clean.
 */
export function buildShareableQuery(state: ShareableState): string {
  const sp = new URLSearchParams();
  if (state.mode === "income") sp.set(PARAM_KEYS.mode, "i");
  if (state.amount.length > 0 && state.amount !== "-") {
    sp.set(PARAM_KEYS.amount, state.amount);
  }
  if (state.age.length > 0) sp.set(PARAM_KEYS.age, state.age);
  const qs = sp.toString();
  return qs.length > 0 ? `?${qs}` : "";
}

/**
 * Build a fully-qualified shareable URL for the current pathname,
 * with the given state encoded as query params.
 */
export function buildShareableUrl(
  origin: string,
  pathname: string,
  state: ShareableState,
): string {
  return `${origin}${pathname}${buildShareableQuery(state)}`;
}

// Hydration-safe constants for `useSyncExternalStore`. The subscribe function
// is stable (no real subscription needed — URL is read on mount only), and the
// snapshot getter returns null during SSR so server/client first render agree.
function noopSubscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): ShareableState | null {
  return null;
}

let cachedClientSnapshot: ShareableState | null = null;
function getClientSnapshot(): ShareableState | null {
  if (cachedClientSnapshot === null) {
    cachedClientSnapshot = readShareableStateFromUrl();
  }
  return cachedClientSnapshot;
}

/**
 * `useShareableState` syncs the calculator state with the URL's query string.
 *
 * - Reads initial state from the URL on first client render (one-time, cached).
 * - Returns a `pushState` function that the caller invokes when state changes.
 *   Updates use `history.replaceState` so the browser back button is unaffected.
 * - Uses `useSyncExternalStore` with `getServerSnapshot=null` to keep SSR and
 *   the first client render in sync (preventing hydration mismatches).
 */
export function useShareableState(): {
  readonly initial: ShareableState | null;
  readonly pushState: (state: ShareableState) => void;
  readonly buildUrl: (state: ShareableState) => string;
} {
  const initial = useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const lastQueryRef = useRef<string | null>(null);

  const pushState = useCallback((state: ShareableState) => {
    if (typeof window === "undefined") return;
    const nextQuery = buildShareableQuery(state);
    if (nextQuery === lastQueryRef.current) return;
    lastQueryRef.current = nextQuery;
    const newUrl = `${window.location.pathname}${nextQuery}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", newUrl);
  }, []);

  const buildUrl = useCallback((state: ShareableState) => {
    if (typeof window === "undefined") return "";
    return buildShareableUrl(
      window.location.origin,
      window.location.pathname,
      state,
    );
  }, []);

  return { initial, pushState, buildUrl };
}
