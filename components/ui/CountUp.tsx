"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  /** Angka awal hitungan (default 0). */
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Durasi animasi (ms). */
  duration?: number;
  /**
   * Putar ulang hitungan setiap kali kursor masuk ke elemen induk bertanda
   * `data-countup-trigger`, dan setiap kali elemen kembali masuk layar.
   */
  replay?: boolean;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function format(n: number, decimals: number) {
  return n.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Angka yang berhitung saat terlihat (dan, bila `replay`, saat kursor diarahkan).
 * Render server menampilkan angka akhir (baik untuk SEO & tanpa JS); pembaca layar
 * selalu membaca angka akhir.
 */
export function CountUp({
  value,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2000,
  replay = false,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    // Hitungan cepat di awal, melambat di akhir; untuk replay dipakai kurva yang
    // lebih landai supaya setiap angka (1, 2, 3, …) sempat terlihat.
    const ease = replay ? easeOutCubic : easeOutExpo;
    let frame = 0;
    let running = false;

    const play = () => {
      if (running) return;
      running = true;
      const start = performance.now();
      setDisplay(from);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplay(from + (value - from) * ease(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else running = false;
      };
      frame = requestAnimationFrame(tick);
    };

    // Mulai dari angka awal hanya jika elemen belum terlihat, agar tidak "berkedip" di layar.
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyVisible) setDisplay(from);
    let played = alreadyVisible;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Keluar layar: siapkan hitungan ulang untuk kunjungan berikutnya.
          if (replay && !running) {
            played = false;
            setDisplay(from);
          }
          return;
        }
        if (played) return;
        played = true;
        play();
        if (!replay) observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    const trigger = replay ? el.closest<HTMLElement>("[data-countup-trigger]") : null;
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") play();
    };
    trigger?.addEventListener("pointerenter", onEnter);

    return () => {
      observer.disconnect();
      trigger?.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(frame);
    };
  }, [value, from, duration, replay]);

  const finalText = `${prefix}${format(value, decimals)}${suffix}`;
  const shown = decimals > 0 ? display : Math.round(display);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {format(shown, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
