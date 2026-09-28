import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

/** Menggunakan asset logo asli di /public/logo — jangan digambar ulang dengan CSS. */
export function Logo({ className = "w-[132px]", priority = false }: LogoProps) {
  const { logo } = siteConfig;
  return (
    <Link href="/" aria-label={`${siteConfig.name} — ke beranda`} className={`inline-block rounded-lg ${className}`}>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
        className="h-auto w-full"
      />
    </Link>
  );
}
