"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProgramTabs({ programId, classCount }: { programId: string; classCount: number }) {
  const pathname = usePathname();
  const base = `/admin/program/${programId}`;
  const tabs = [
    { href: base, label: "Info & konten", active: pathname === base },
    { href: `${base}/kelas`, label: "Jadwal kelas", count: classCount, active: pathname.startsWith(`${base}/kelas`) },
  ];
  return (
    <nav aria-label="Bagian program" className="mb-8 border-b border-line">
      <ul className="-mb-px flex gap-6">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`inline-flex h-10 items-center gap-2 border-b-2 text-sm font-medium transition-colors ${
                tab.active ? "border-brand-teal text-ink" : "border-transparent text-ink-soft hover:border-line hover:text-ink"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-md bg-[var(--adm-hover)] px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft">{tab.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
