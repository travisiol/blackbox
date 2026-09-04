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
 * to care is a real cost, and the usual fix — seeding it with invented
 * volume — is a lie told at the top of the page. So the default stays honest
 * (zero, sealed, awaiting launch) and the fill is put behind a control the
 * visitor presses themselves. They get to watch the mechanic work; nobody
 * gets told it already has.
 *
 * The badge is a status, not a disclaimer: it says "awaiting launch" whether
 * or not the demo is running, and the dot beside it is what separates a box
 * taking trades from a box sitting still. The disclosure that the moving
 * figures are generated in the browser lives in the line under the control
 * that starts them, which is where somebody who just pressed it is looking.
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

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              onClick={isSimulating ? stopSimulation : startSimulation}
              aria-pressed={isSimulating}
            >
              {isSimulating ? "Stop the simulation" : "Watch it fill"}
            </Button>
            <Button variant="quiet" onClick={() => scrollTo("mechanic")}>
              How it works
            </Button>
          </div>

          <p className="type-data mt-5 max-w-[44ch] text-chalk-muted">
            {isSimulating
              ? "These figures are generated in your browser to demonstrate the mechanic. Nothing here is a reading off a chain."
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
