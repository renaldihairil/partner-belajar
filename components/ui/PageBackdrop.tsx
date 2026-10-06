/** Latar berwarna lembut (blob + titik) untuk halaman mandiri seperti form publik. Letakkan di dalam wadah `relative isolate`. */
export function PageBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop absolute inset-0 -z-10">
      <div className="hero-blob hero-blob--yellow" />
      <div className="hero-blob hero-blob--teal" />
      <div className="hero-blob hero-blob--blue" />
      <div className="hero-dots absolute inset-0" />
    </div>
  );
}
