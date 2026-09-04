import { clsx } from "clsx";
import type { ReactNode } from "react";

/** A key on the panel: mono, tracked out, uppercase. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("type-label text-chalk-muted", className)}>
      {children}
    </span>
  );
}

/**
 * Marks the readout as pre-launch.
 *
 * The box reads zero because nothing has traded, and that is the honest
 * state, not a broken one. This tag is what keeps a zero from looking like a
 * bug — and what keeps the simulation, when a visitor asks for it, from being
 * mistaken for a live figure.
 */
export function StateTag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "type-label inline-flex items-center gap-2 border border-edge px-2.5 py-1.5 text-chalk-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
