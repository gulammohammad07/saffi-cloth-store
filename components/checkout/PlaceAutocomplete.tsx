"use client";

import { useMemo, useRef, useState } from "react";
import { Check, MapPin } from "lucide-react";
import { matchOptions } from "@/lib/data/geo";
import { cn } from "@/lib/utils";

/**
 * A plain text input that suggests options while you type (City / State /
 * Country on checkout). Free text is always allowed — suggestions only speed
 * up entry. The input keeps its `name`, so FormData submission keeps working.
 */
export default function PlaceAutocomplete({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(
    () => matchOptions(value, options, 8),
    [value, options],
  );
  const showList = open && matches.length > 0;

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((current) => (current + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight(
        (current) => (current - 1 + matches.length) % matches.length,
      );
    } else if (event.key === "Enter") {
      // Enter picks the highlighted (or first) suggestion instead of
      // submitting the form mid-typing.
      if (highlight >= 0 && matches[highlight]) {
        event.preventDefault();
        select(matches[highlight]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        name={name}
        value={value}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => {
            setOpen(false);
            setHighlight(-1);
          }, 120);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        aria-controls={`${name}-suggestions`}
        aria-label={placeholder}
        className="w-full rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />

      {showList && (
        <ul
          id={`${name}-suggestions`}
          role="listbox"
          className="absolute top-full left-0 z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#1C1A17]/10 bg-white py-1.5 shadow-[0_20px_50px_-16px_rgba(19,17,16,0.3)]"
          onMouseDown={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
        >
          {matches.map((option, index) => (
            <li key={option} role="option" aria-selected={highlight === index}>
              <button
                type="button"
                onClick={() => select(option)}
                onMouseEnter={() => setHighlight(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  highlight === index
                    ? "bg-gold/10 text-ink"
                    : "text-ink/60",
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <MapPin
                    size={14}
                    className="shrink-0 text-gold/60"
                    aria-hidden
                  />
                  <span className="truncate">{option}</span>
                </span>
                {highlight === index && (
                  <Check size={14} className="shrink-0 text-gold" aria-hidden />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
