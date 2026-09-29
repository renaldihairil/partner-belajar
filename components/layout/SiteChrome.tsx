import type { ReactNode } from "react";
import { RegistrationProvider } from "@/components/registration/RegistrationProvider";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { AppShell } from "./AppShell";

/** Kerangka situs publik: sidebar/bottom nav + formulir pendaftaran global. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const programs = await getProgramsWithClasses();
  return (
    <RegistrationProvider programs={programs}>
      <AppShell>{children}</AppShell>
    </RegistrationProvider>
  );
}
