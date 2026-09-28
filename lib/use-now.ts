"use client";

import { useEffect, useState } from "react";

/**
 * Waktu "sekarang" yang aman untuk hydration: render awal memakai waktu server,
 * lalu diganti jam pengunjung dan diperbarui setiap menit.
 */
export function useNow(serverNow: number, intervalMs = 60_000) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}
