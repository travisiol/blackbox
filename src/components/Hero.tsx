"use client";

import { clsx } from "clsx";
import { Box } from "@/components/Box";
import { Counter } from "@/components/Counter";
import { Ladder } from "@/components/Ladder";
import { Button } from "@/components/ui/Button";
import { Label, StateTag } from "@/components/ui/Label";
import { useBox } from "@/lib/boxState";
import { formatUsd } from "@/lib/format";
import { BUYBACK_SHARE, FEE_BPS, siteConfig } from "@/lib/site-config";

const FEE_PCT = FEE_BPS / 100;
const BUYBACK_PCT = Math.round(BUYBACK_SHARE * 100);
const HOLDER_PCT = 100 - BUYBACK_PCT;

/*
 * The box sits in the middle column, literally at the centre of the page,
 * with the pitch to its left and the marks to its right. Everything else on
 * the site is below the fold and exists to explain what this one object is
 * doing.
 *
 * The hardest problem here is not the layout, it is that on day one the box
 * is empty. An empty hero at the exact moment a visitor is deciding whether
 * to care is a real cost — so the box runs a preview of the mechanic from the
 * moment the page loads, filling and opening on its own.
 *
 * That buys the first impression at a price, and the price has to be paid
 * honestly. The usual version of this — seeding the page with invented volume
 * and saying nothing — is a lie told at the top of a site. This one says what
 * it is in three places a reader cannot miss: the line directly under these
 * controls, the control itself, and the chip on the ledger. Stopping the
 * preview drops the whole site back to the true state, zero and sealed, which
 * is the test of whether the labelling was real.
 *
 * The badge is a status, not a disclaimer: it says "awaiting launch" whether
 * or not the preview is running, and the dot beside it is what separates a box
 * taking trades from a box sitting still.
 */
export function Hero() {
  const {
    filled,
    serial,
    status,
    target,
    progress,
    isSimulating,
    isLive,
    startSimulation,
    stopSimulation,
  } = useBox();

  const isOpening = status === "opening";

  return (
    <section className="relative border-b border-edge px-4 pt-10 pb-14 sm:px-6 lg:pt-16">
      <div
        className={clsx(
          "mx-auto grid max-w-[1400px] items-center gap-12",
          "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.8fr)] lg:gap-10",
        )}
      >
        {/* ---- The pitch --------------------------------------------- */}
        <div className="order-2 lg:order-1">
          <StateTag className="mb-6">
            <span
              className={clsx(
                "h-1.5 w-1.5",
                isSimulating ? "bg-lumen" : "bg-chalk-muted",
              )}
            />
            {isLive ? "Live" : "Awaiting launch"}
          </StateTag>

          <h1 className="type-hero text-chalk">
            Every trade
            <br />
            fills the box.
          </h1>

          <p className="type-body mt-6 max-w-[46ch] text-chalk-soft">
            Every trade of {siteConfig.ticker} pays a {FEE_PCT}% fee, and every
            cent of it goes into one sealed box. Nothing else touches what is
            inside.
          </p>

          <p className="type-body mt-4 max-w-[46ch] text-chalk-soft">
            The box has four marks on it. Reach one and it opens:{" "}
            <span className="text-chalk">
              {BUYBACK_PCT}% buys {siteConfig.ticker} back off the market,{" "}
              {HOLDER_PCT}% is paid out to the people holding it.
            </span>{" "}
            Then it reseals, empty, and the next mark is higher.
          </p>

          {/* The box already runs on arrival, so "watch it fill" is no longer
              the thing to ask for — the primary action becomes the one a
              visitor who has just been caught by the object actually wants.
              The stop control stays, quietly, because a readout that moves on
              its own has to be stoppable. */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={() => scrollTo("mechanic")}>How it works</Button>
            <Button
              variant="quiet"
              onClick={isSimulating ? stopSimulation : startSimulation}
              aria-pressed={isSimulating}
            >
              {isSimulating ? "Stop the preview" : "Watch it fill"}
            </Button>
          </div>

          <p className="type-data mt-5 max-w-[46ch] text-chalk-muted">
            {isSimulating
              ? "The box above is running a preview of the mechanic. Those figures are generated in your browser — nothing is being read off a chain, and no trade has happened yet."
              : "The counter reads zero because no trade has happened yet. Press ‘watch it fill’ to see what one cycle looks like."}
          </p>
        </div>

        {/* ---- The box ------------------------------------------------ */}
        <div className="order-1 lg:order-2">
          <div className="readout mx-auto flex max-w-[440px] flex-col items-center">
            {/* The serial is struck into the lid a few centimetres below;
                repeating it here would just be the same number twice. */}
            <Label className="w-full">In the box</Label>

            <Counter value={filled} className="mt-3" />

            <p className="type-data mt-3 text-chalk-muted">
              of {formatUsd(target.amountUsd)} to mark {target.mark}
            </p>

            <Box
              progress={progress}
              isOpening={isOpening}
              serial={serial}
            />

            {/* The state plate. Three words, one of which is always true. */}
            <div className="-mt-1 flex w-full items-center justify-center gap-3 border-t border-edge pt-4">
              <span
                aria-hidden
                className={clsx(
                  "h-1.5 w-1.5 transition-colors duration-300",
                  isOpening
                    ? "bg-lumen"
                    : status === "filling"
                      ? "bg-chalk-soft"
                      : "bg-chalk-muted",
                )}
              />
              <span
                className={clsx(
                  "type-label transition-colors duration-300",
                  isOpening ? "text-lumen" : "text-chalk-soft",
                )}
              >
                {isOpening
                  ? `Open — releasing ${formatUsd(target.amountUsd)}`
                  : status === "filling"
                    ? "Filling"
                    : "Sealed"}
              </span>
            </div>
          </div>
        </div>

        {/* ---- The marks ---------------------------------------------- */}
        <div className="order-3">
          <Ladder />
        </div>
      </div>
    </section>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
