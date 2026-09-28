import Image from "next/image";

type CharacterIllustrationProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  float?: boolean;
  className?: string;
};

/** Ilustrasi karakter anak Muslim faceless. */
export function CharacterIllustration({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  float = false,
  className = "",
}: CharacterIllustrationProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={`h-auto select-none ${float ? "animate-float" : ""} ${className}`}
    />
  );
}
