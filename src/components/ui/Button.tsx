import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * Buttons are machined plates, not filled shapes.
 *
 * Nothing on this page is allowed to be white at rest except the counter and
 * the contents of the box, so a resting button is an outline with a lit top
 * edge — and it floods white on hover. The reward for reaching for a control
 * is the same reward the box gives: something goes bright.
 */
const base =
  "type-label lit-edge inline-flex items-center justify-center gap-2 px-5 py-3.5 " +
  "transition-colors duration-200 disabled:cursor-not-allowed";

export function Button({
  children,
  variant = "plate",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "plate" | "quiet";
}) {
  return (
    <button
      type="button"
      className={clsx(
        base,
        variant === "plate"
          ? "border border-edge-strong bg-shell text-chalk hover:bg-lumen hover:text-void-deep disabled:border-edge disabled:bg-transparent disabled:text-chalk-muted disabled:hover:bg-transparent disabled:hover:text-chalk-muted"
          : "border border-edge bg-transparent text-chalk-soft hover:border-edge-strong hover:text-chalk disabled:text-chalk-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={clsx(
        base,
        "border border-edge-strong bg-shell text-chalk hover:bg-lumen hover:text-void-deep",
        className,
      )}
    >
      {children}
    </a>
  );
}
