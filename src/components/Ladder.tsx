"use client";

import { clsx } from "clsx";
import { useBox } from "@/lib/boxState";
import { formatUsd } from "@/lib/format";
import { thresholds } from "@/lib/thresholds";
import { Label } from "@/components/ui/Label";

/*
 * The marks, as a ladder.
 *
 * Drawn bottom-up — I at the floor, IV at the top — because that is the
 * direction the box is going, and a list that counts down while the thing
 * beside it counts up makes a reader do arithmetic they should not have to do.
 *
 * The rungs are evenly spaced even though the amounts are not. They are
 * milestones, not a scale; spacing them proportionally would crush I, II and
 * III into the bottom eighth and make the one part of the mechanic a visitor
 * can actually reach look like a rounding error.
 */
export function Ladder() {
  const { cleared, status, target } = useBox();

  return (
    <div className="w-full">
      <Label className="mb-4 block">The marks</Label>

      <ol className="flex flex-col-reverse">
        {thresholds.map((threshold, index) => {
          const isCleared = index < cleared;
          const isCurrent = index === cleared;
          const isOpening = isCurrent && status === "opening";

          return (
            <li
              key={threshold.mark}
              className={clsx(
                "flex items-center gap-4 border-t border-edge py-3.5 transition-opacity duration-500",
                !isCurrent && !isCleared && "opacity-40",
                isCleared && "opacity-25",
              )}
            >
              {/* The rung. Lit only for the mark being filled toward. */}
              <span
                aria-hidden
                className={clsx(
                  "h-px shrink-0 transition-all duration-500",
                  isCurrent ? "w-8 bg-lumen" : "w-4 bg-chalk-muted",
                )}
              />

              <span
                className={clsx(
                  "type-figure w-9 shrink-0",
                  isCurrent ? "text-lumen" : "text-chalk-soft",
                )}
              >
                {threshold.mark}
              </span>

              <span className="flex flex-1 items-baseline justify-between gap-3">
                <span
                  className={clsx(
                    "type-data",
                    isCurrent ? "text-chalk" : "text-chalk-soft",
                  )}
                >
                  {formatUsd(threshold.amountUsd)}
                </span>

                {/* The rung has to agree with the plate under the box. A mark
                    reading "filling" while the box reads "sealed" is two
                    parts of the same instrument contradicting each other. */}
                <span className="type-label shrink-0 text-chalk-muted">
                  {isCleared
                    ? "Opened"
                    : isOpening
                      ? "Opening"
                      : isCurrent
                        ? status === "filling"
                          ? "Filling"
                          : "Next"
                        : "Sealed"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="type-data mt-5 border-t border-edge pt-4 text-chalk-muted">
        Next: {formatUsd(target.amountUsd)} at mark {target.mark}. Clearing IV
        retires the box and seals a new one.
      </p>
    </div>
  );
}
