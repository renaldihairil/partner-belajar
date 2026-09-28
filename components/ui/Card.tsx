import type { CSSProperties, ElementType, ReactNode } from "react";

export type CardTone = "surface" | "teal" | "yellow" | "blue" | "green" | "purple" | "cream";

export const cardTones: Record<CardTone, string> = {
  surface: "bg-surface border border-line shadow-soft",
  teal: "bg-brand-teal-soft",
  yellow: "bg-brand-yellow-soft",
  blue: "bg-soft-blue",
  green: "bg-soft-green",
  purple: "bg-soft-purple",
  cream: "bg-soft-cream",
};

type CardProps = {
  as?: ElementType;
  tone?: CardTone;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Card({ as: Tag = "div", tone = "surface", interactive = false, className = "", style, children }: CardProps) {
  return (
    <Tag
      style={style}
      className={`relative overflow-hidden rounded-[var(--radius-card)] ${cardTones[tone]} ${
        interactive ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
