"use client";

import type { ReactNode } from "react";
import { useRegistration, type RegistrationRequest } from "./RegistrationProvider";

type RegisterButtonProps = RegistrationRequest & {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/** Tombol yang membuka formulir pendaftaran WhatsApp dengan program/kelas/paket yang sudah terpilih. */
export function RegisterButton({ programSlug, classId, planId, intent, className, children, ...rest }: RegisterButtonProps) {
  const { open } = useRegistration();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => open({ programSlug, classId, planId, intent })}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
