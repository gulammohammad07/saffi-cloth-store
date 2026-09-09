"use client";

import { useState, type ComponentProps } from "react";
import { m as motion } from "framer-motion";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

type AuthFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  icon?: LucideIcon;
  inputClassName?: string;
};

export function AuthField({
  id,
  label,
  error,
  icon: Icon,
  className,
  inputClassName,
  type = "text",
  ...props
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && visible ? "text" : type;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-ink/60 uppercase"
      >
        {label}
      </label>

      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-colors ${
              error ? "text-destructive" : "text-ink/30"
            }`}
          />
        ) : null}

        <input
          id={id}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-xl border bg-cream/60 text-sm text-ink transition-all outline-none placeholder:text-ink/30 focus:bg-white focus:ring-4 ${
            Icon ? "pr-4 pl-11" : "px-4"
          } ${
            isPassword ? "pr-11" : ""
          } ${
            error
              ? "border-destructive/60 focus:border-destructive focus:ring-destructive/10"
              : "border-ink/12 focus:border-gold focus:ring-gold/15"
          } ${inputClassName ?? ""}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-ink/30 transition-colors hover:text-ink/60"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-start gap-1.5 text-xs leading-snug text-destructive"
        >
          <span className="mt-[3px] block h-1 w-1 shrink-0 rounded-full bg-destructive" />
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}
