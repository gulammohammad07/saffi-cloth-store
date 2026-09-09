import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Circular image nav arrow used over product imagery. Resting state is a
 * deep-teal gradient chip (brand) with a white chevron; hover melts it into
 * the gold gradient. Same component on cards, PDP viewer and quick view so
 * the chevrons look identical everywhere.
 */
export default function ImageNavArrow({
  direction,
  onClick,
  ariaLabel,
  variant = "light",
  size = 18,
  className,
}: {
  direction: "left" | "right";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  variant?: "light" | "dark";
  size?: number;
  className?: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full ring-1 backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 active:scale-95 sm:h-10 sm:w-10",
        direction === "left" ? "left-2.5" : "right-2.5",
        variant === "light"
          ? "bg-gradient-to-br from-[#1d5f7d] to-[#131110] text-white ring-white/25 shadow-[0_4px_14px_rgba(19,17,16,0.35),0_16px_28px_-10px_rgba(19,17,16,0.55)] hover:bg-gradient-to-br hover:from-gold hover:to-gold-light hover:text-ink hover:ring-gold/70 hover:shadow-[0_8px_24px_-6px_rgba(188,78,34,0.65)]"
          : "bg-white/10 text-white ring-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.4),0_16px_28px_-12px_rgba(0,0,0,0.6)] hover:bg-gradient-to-br hover:from-gold hover:to-gold-light hover:text-ink hover:ring-gold/60 hover:shadow-[0_8px_22px_-6px_rgba(188,78,34,0.55)]",
        className,
      )}
    >
      <Icon size={size} strokeWidth={2.5} />
    </button>
  );
}
