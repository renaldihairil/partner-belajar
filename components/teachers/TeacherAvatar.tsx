import type { Teacher } from "@/types";

const hijabColors = ["#f2b632", "#16a79c", "#8a6fd8", "#f08a5d"];

/**
 * Avatar ilustrasi faceless (berpeci / berhijab) — konsisten dengan karakter brand.
 * Warna hijab bervariasi berdasar id agar tiap pengajar mudah dibedakan.
 */
export function TeacherAvatar({ teacher, className = "" }: { teacher: Teacher; className?: string }) {
  const seed = [...teacher.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const accent = hijabColors[seed % hijabColors.length];

  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`Ilustrasi ${teacher.name}`} className={className}>
      <defs>
        <radialGradient id={`skin-${teacher.id}`} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fbdcc4" />
          <stop offset="1" stopColor="#efbf9f" />
        </radialGradient>
      </defs>
      {teacher.gender === "akhwat" ? (
        <>
          {/* Badan & hijab */}
          <path d="M18 122c2-26 18-40 42-40s40 14 42 40z" fill="#16a79c" />
          <path d="M26 118c-6-40 2-86 34-88 32 2 40 48 34 88-10 4-22 6-34 6s-24-2-34-6z" fill={accent} />
          <path d="M34 110c-2-26 6-54 26-56 20 2 28 30 26 56" fill={accent} opacity="0.85" />
          {/* Wajah (faceless) */}
          <ellipse cx="60" cy="60" rx="19" ry="22" fill={`url(#skin-${teacher.id})`} />
          <ellipse cx="50" cy="68" rx="4" ry="2.4" fill="#f4a6a0" opacity="0.5" />
          <ellipse cx="70" cy="68" rx="4" ry="2.4" fill="#f4a6a0" opacity="0.5" />
          <path d="M40 50c4-16 36-16 40 0" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Badan & kerah */}
          <path d="M18 122c2-26 18-40 42-40s40 14 42 40z" fill="#16a79c" />
          <path d="M50 84l10 12 10-12" fill="none" stroke="#0e7f7a" strokeWidth="3" strokeLinejoin="round" />
          <rect x="53" y="74" width="14" height="12" rx="5" fill="#efbf9f" />
          {/* Kepala, telinga, rambut */}
          <circle cx="38" cy="60" r="5" fill="#efbf9f" />
          <circle cx="82" cy="60" r="5" fill="#efbf9f" />
          <circle cx="60" cy="58" r="23" fill={`url(#skin-${teacher.id})`} />
          <path d="M37 52c0-10 10-17 23-17s23 7 23 17c-6-4-14-6-23-6s-17 2-23 6z" fill="#5a3b2a" />
          <ellipse cx="49" cy="66" rx="4" ry="2.4" fill="#f4a6a0" opacity="0.5" />
          <ellipse cx="71" cy="66" rx="4" ry="2.4" fill="#f4a6a0" opacity="0.5" />
          {/* Peci */}
          <path d="M36 44c0-14 48-14 48 0v4H36z" fill="#f7f8f8" />
          <path d="M36 44h48v4H36z" fill="#e3e8e8" />
        </>
      )}
    </svg>
  );
}
