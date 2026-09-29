"use client";

import { startTransition, useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/app/admin/actions/auth";
import { FormMessage, TextField } from "./fields";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        // Kirim manual agar email tidak terhapus saat password salah.
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="next" value={next ?? ""} />
      <TextField label="Email" name="email" type="email" autoComplete="username" required autoFocus />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
      <FormMessage state={state} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-teal-strong px-6 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <LogIn aria-hidden className="size-4" />}
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
