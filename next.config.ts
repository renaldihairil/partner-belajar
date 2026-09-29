import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Foto yang diunggah lewat admin (Vercel Blob).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  poweredByHeader: false,
  // Database lokal (development) memakai WebAssembly — dimuat langsung dari node_modules.
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
    // Halaman dinamis (admin) disimpan sebentar di browser: bolak-balik antarmenu terasa instan.
    // Setelah admin menyimpan, cache ini dibersihkan otomatis oleh revalidatePath.
    staleTimes: { dynamic: 30 },
  },
};

export default nextConfig;
