/** Kerangka ringan yang langsung tampil saat berpindah halaman (sidebar & bottom nav tetap). */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman" className="animate-pulse">
      <div className="h-10 w-48 rounded-full bg-background md:h-12 md:w-64" />
      <div className="mt-3 h-4 w-full max-w-md rounded-full bg-background" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-40 rounded-[var(--radius-card)] bg-background md:h-56" />
        ))}
      </div>
    </div>
  );
}
