/** Ornamen dekoratif ringan (SVG inline) — semuanya aria-hidden. */

export function LeafCloud({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 80" className={className} fill="currentColor">
      <path d="M22 78c-12 0-20-8-20-18 0-9 7-17 16-18 1-15 13-27 28-27 6 0 11 2 15 5 5-12 16-20 29-20 17 0 30 14 30 31 0 5-1 9-3 13 2 3 3 6 3 10 0 13-10 24-23 24H22z" />
    </svg>
  );
}


export function SunRays({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={className}>
      <circle cx="26" cy="28" r="10" fill="var(--brand-yellow)" />
      <g stroke="var(--brand-yellow-dark)" strokeWidth="3" strokeLinecap="round">
        <path d="M26 6v6" />
        <path d="M8 16l5 3" />
        <path d="M44 16l-5 3" />
        <path d="M14 7l3 5" />
        <path d="M38 7l-3 5" />
      </g>
    </svg>
  );
}

