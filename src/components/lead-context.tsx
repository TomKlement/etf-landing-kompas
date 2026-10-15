"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "etfk-unlocked";
const EVENT = "etfk-unlock";

// In-memory fallback so unlocking still works when storage is blocked.
let memoryEmail: string | null = null;

function readEmail(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memoryEmail;
  } catch {
    return memoryEmail;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

type LeadState = {
  unlocked: boolean;
  email: string | null;
  unlock: (email: string) => void;
};

const LeadContext = createContext<LeadState | null>(null);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  // Returning visitors who already left an e-mail shouldn't hit the gate again.
  const email = useSyncExternalStore(subscribe, readEmail, () => null);

  const unlock = useCallback((value: string) => {
    memoryEmail = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore – memory fallback covers this visit */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <LeadContext.Provider value={{ unlocked: email !== null, email, unlock }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used inside <LeadProvider>");
  return ctx;
}
