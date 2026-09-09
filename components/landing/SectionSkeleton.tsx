import type { CSSProperties } from "react";

type SectionSkeletonProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className: string;
  style?: CSSProperties;
};

export default function SectionSkeleton({
  eyebrow,
  title,
  description,
  className,
  style,
}: SectionSkeletonProps) {
  return (
    <section
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-28 pb-28 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
