"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProgramTabs({ programId, classCount }: { programId: string; classCount: number }) {
  const pathname = usePathname();
  const base = `/admin/program/${programId}`;
  const tabs = [
    { href: base, label: "Info & konten", active: pathname === base },
    { href: `${base}/kelas`, label: `Jadwal kelas (${classCount})`, active: pathname.startsWith(`${base}/kelas`) },
  ];
  return (
    <nav aria-label="Bagian program" className="mb-6 flex gap-1 rounded-full bg-surface p-1 ring-1 ring-line sm:w-max">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={`inline-flex min-h-10 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors sm:flex-none ${
            tab.active ? "bg-brand-teal-strong text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
