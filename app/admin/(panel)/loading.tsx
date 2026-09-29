/** Kerangka instan saat pindah halaman admin (tampil sebelum data selesai dimuat). */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman" className="adm-fade-in">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="grid gap-2">
          <div className="adm-skeleton h-7 w-48 rounded-md" />
          <div className="adm-skeleton h-4 w-72 max-w-full rounded-md" />
        </div>
        <div className="adm-skeleton h-9 w-36 rounded-lg" />
      </div>
      <div className="overflow-clip rounded-2xl border border-line bg-surface shadow-soft">
        <div className="border-b border-line px-5 py-3">
          <div className="adm-skeleton h-4 w-32 rounded-md" />
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
            <div className="adm-skeleton size-10 shrink-0 rounded-lg" />
            <div className="grid flex-1 gap-2">
              <div className="adm-skeleton h-4 w-1/3 rounded-md" />
              <div className="adm-skeleton h-3 w-1/2 rounded-md" />
            </div>
            <div className="adm-skeleton hidden h-8 w-28 rounded-lg sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
