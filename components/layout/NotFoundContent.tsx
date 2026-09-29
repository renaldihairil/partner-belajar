import { ButtonLink } from "@/components/ui/Button";

export function NotFoundContent() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-brand-teal">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink md:text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-ink-soft">Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
      <ButtonLink href="/" className="mt-6">
        Kembali ke Home
      </ButtonLink>
    </section>
  );
}
