"use client";

import { clsx } from "clsx";
import { formatCounter } from "@/lib/format";

/** The widest reading the panel is built to hold. */
const WIDEST = formatCounter(999_999.99);

/*
 * What the box holds, read off the box.
 *
 * The hidden sizer is the whole trick: the panel is always the width of the
 * largest number it could show, so the box underneath never shifts sideways
 * while the counter climbs past a thousand — the way a physical readout is
 * the size of its display, not the size of what is currently on it.
 */
export function Counter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={clsx("lcd type-counter", className)}>
      <span className="lcd__sizer" aria-hidden>
        {WIDEST}
      </span>

      <span className="lcd__value">{formatCounter(value)}</span>
    </span>
  );
}
