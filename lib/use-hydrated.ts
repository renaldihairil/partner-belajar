"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false saat render di server dan sebelum halaman "hidup" di browser, true sesudahnya.
 * Dipakai untuk menonaktifkan tombol kirim formulir yang dikirim lewat skrip: tanpa ini, klik/Enter
 * yang terlalu cepat membuat browser mengirim formulir secara bawaan (GET) dan mengisi URL dengan
 * isian formulir, termasuk kata sandi atau PIN.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
