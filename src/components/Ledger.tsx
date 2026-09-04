"use client";

import { useBox } from "@/lib/boxState";
import { formatUsd } from "@/lib/format";
import { BUYBACK_SHARE, siteConfig } from "@/lib/site-config";
import { Label } from "@/components/ui/Label";

/*
 * Every opening, kept.
 *
 * This section is empty on day one and that emptiness is doing work: it is
 * the page's proof that nothing on it has been pre-filled. Once the contract
 * is live these rows come from its Opened events and nowhere else, which is
 * also the answer to the obvious objection to the name — the box is opaque,
 * the ledger of what came out of it is not.
 */
export function Ledger() {
  const { openings, isSimulating } = useBox();

  return (
    <section
      id="ledger"
      className="scroll-mt-16 border-b border-edge px-4 py-16 sm:px-6 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Label className="mb-3 block">The ledger</Label>
            <h2 className="type-display text-chalk">Every opening, kept</h2>
          </div>
          {isSimulating && openings.length > 0 && (
            <span className="type-label border border-edge px-2.5 py-1.5 text-chalk-soft">
              Simulated
            </span>
          )}
        </div>

        <p className="type-body mt-4 mb-10 max-w-[62ch] text-chalk-soft">
          The box is black. The record of what came out of it is not — every
          opening is an event on chain, with the amount released, the amount
          spent buying {siteConfig.ticker} back, and the amount paid to
          holders.
        </p>

        {openings.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center px-6 py-16 text-center">
            <span
              aria-hidden
              className="mb-5 h-8 w-8 border border-edge-strong bg-void-deep"
            />
            <p className="type-title text-chalk">No box has opened yet</p>
            <p className="type-body mt-3 max-w-[46ch] text-chalk-soft">
              Nothing has traded, so nothing has filled, so nothing has been
              released. This list stays empty until the first mark is reached.
            </p>
          </div>
        ) : (
          <ul className="border-t border-edge">
            {openings.map((opening, index) => (
              <li
                key={`${opening.serial}-${opening.mark}-${index}`}
                className="grid grid-cols-2 items-baseline gap-x-6 gap-y-2 border-b border-edge py-5 sm:grid-cols-[auto_1fr_auto_auto]"
              >
                <span className="type-label text-chalk-muted">
                  N&#186; {String(opening.serial).padStart(3, "0")} · mark{" "}
                  {opening.mark}
                </span>

                <span className="type-figure text-chalk sm:text-right">
                  {formatUsd(opening.amountUsd)}
                </span>

                <span className="type-data text-chalk-soft sm:text-right">
                  {formatUsd(opening.amountUsd * BUYBACK_SHARE)} bought back
                </span>

                <span className="type-data text-chalk-soft sm:text-right">
                  {formatUsd(opening.amountUsd * (1 - BUYBACK_SHARE))} to
                  holders
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
