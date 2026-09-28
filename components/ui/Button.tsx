import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-yellow text-on-accent shadow-[0_10px_20px_-12px_rgb(233_169_0/0.9)] hover:bg-[#fac93f] hover:shadow-[0_14px_24px_-12px_rgb(233_169_0/0.9)]",
  secondary: "border-2 border-brand-teal bg-surface text-brand-teal-dark hover:bg-brand-teal-soft",
};

type CommonProps = {
  variant?: Variant;
  withArrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

function Content({ icon, withArrow, children }: Pick<CommonProps, "icon" | "withArrow" | "children">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {withArrow && (
        <ArrowRight aria-hidden className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  withArrow = true,
  icon,
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      <Content icon={icon} withArrow={withArrow}>
        {children}
      </Content>
    </Link>
  );
}

export function Button({
  variant = "primary",
  withArrow = true,
  icon,
  className = "",
  children,
  ...props
}: CommonProps & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">) {
  return (
    <button className={`${base} ${variants[variant]} disabled:opacity-60 ${className}`} {...props}>
      <Content icon={icon} withArrow={withArrow}>
        {children}
      </Content>
    </button>
  );
}
