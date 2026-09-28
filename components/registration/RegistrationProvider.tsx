"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { captureAttribution } from "@/lib/tracking";
import type { LeadIntent, ProgramWithClasses } from "@/types";
import { RegistrationDialog } from "./RegistrationDialog";

export type RegistrationRequest = {
  programSlug?: string;
  classId?: string;
  planId?: string;
  intent?: LeadIntent;
};

type RegistrationContextValue = {
  open: (request?: RegistrationRequest) => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration harus dipakai di dalam <RegistrationProvider>");
  return ctx;
}

type RegistrationProviderProps = {
  programs: ProgramWithClasses[];
  children: ReactNode;
};

/** Satu formulir pendaftaran untuk seluruh situs; dibuka dari tombol mana pun lewat useRegistration(). */
export function RegistrationProvider({ programs, children }: RegistrationProviderProps) {
  const [request, setRequest] = useState<RegistrationRequest | null>(null);
  // Menaikkan key membuat formulir mulai bersih setiap kali dibuka.
  const [session, setSession] = useState(0);

  useEffect(() => {
    captureAttribution();
  }, []);

  const open = useCallback((next: RegistrationRequest = {}) => {
    setSession((value) => value + 1);
    setRequest(next);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      <RegistrationDialog key={session} programs={programs} request={request} onClose={() => setRequest(null)} />
    </RegistrationContext.Provider>
  );
}
