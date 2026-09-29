import { requireOwner } from "@/lib/auth/session";

/** Hanya Pemilik yang boleh mengelola admin lain. */
export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireOwner();
  return children;
}
