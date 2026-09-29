"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { sessionSecret } from "@/lib/auth/token";
import type { ActionState } from "@/lib/admin/form";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
  next: z.string().optional(),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  const { email, password, next } = parsed.data;

  if (!sessionSecret()) return { message: "AUTH_SECRET belum diatur di Environment Variables (minimal 32 karakter)." };
  const db = await getDb();
  if (!db) return { message: "Database belum terhubung. Hubungkan Neon di Vercel (Storage) lalu deploy ulang." };

  // Batasi percobaan login per email.
  const key = `login:${email}`;
  const since = new Date(Date.now() - WINDOW_MS);
  const [{ value: attempts }] = await db
    .select({ value: count() })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.key, key), gte(schema.loginAttempts.createdAt, since)));
  if (attempts >= MAX_ATTEMPTS) return { message: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };

  // Admin pertama dibuat otomatis dari ADMIN_EMAIL & ADMIN_PASSWORD (hanya saat belum ada admin sama sekali).
  const [{ value: adminCount }] = await db.select({ value: count() }).from(schema.adminUsers);
  if (adminCount === 0) {
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envEmail || !envPassword) {
      return { message: "Belum ada akun admin. Atur ADMIN_EMAIL dan ADMIN_PASSWORD di Environment Variables." };
    }
    if (email === envEmail && password === envPassword) {
      await db.insert(schema.adminUsers).values({
        id: crypto.randomUUID(),
        email,
        name: "Admin",
        passwordHash: await hashPassword(password),
      });
    }
  }

  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    await db.insert(schema.loginAttempts).values({ key });
    return { message: "Email atau password salah." };
  }

  await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.key, key));
  await db.update(schema.adminUsers).set({ lastLoginAt: new Date() }).where(eq(schema.adminUsers.id, user.id));
  await createSession({ sub: user.id, email: user.email, name: user.name });

  redirect(next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
