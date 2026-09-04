import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { BUYBACK_SHARE, FEE_BPS, siteConfig } from "@/lib/site-config";

const FEE_PCT = FEE_BPS / 100;
const BUYBACK_PCT = Math.round(BUYBACK_SHARE * 100);
const HOLDER_PCT = 100 - BUYBACK_PCT;

/*
 * Four beats, and the glyphs are drawn in the box's own language — squares,
 * seams, level lines and light — rather than in the usual kit of arrows and
 * coins. By the fourth panel the reader has seen the same rectangle four
 * times in four states, which teaches the object faster than the sentences
 * underneath it do.
 */

function Plate({ children }: { children: ReactNode }) {
  return (
    <span className="lit-edge relative inline-flex h-[72px] w-[72px] items-center justify-center border border-edge bg-shell">
      {children}
    </span>
  );
}

/** 1 — a trade: two blocks passing in opposite directions. */
function TradeGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden fill="none">
      <path d="M4 12 H24" stroke="#93959d" strokeWidth="1.6" />
      <path d="M19 7 L24 12 L19 17" stroke="#93959d" strokeWidth="1.6" />
      <path d="M30 22 H10" stroke="#5e6068" strokeWidth="1.6" />
      <path d="M15 27 L10 22 L15 17" stroke="#5e6068" strokeWidth="1.6" />
    </svg>
  );
}

/** 2 — the box taking it in: a shut container with a level rising. */
function FillGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <rect x="7" y="9" width="20" height="19" fill="none" stroke="#93959d" strokeWidth="1.6" />
      <rect x="9" y="20" width="16" height="6" fill="#ffffff" opacity="0.75" />
      <path d="M17 2 V7" stroke="#5e6068" strokeWidth="1.6" />
      <path d="M13.5 4.5 L17 8 L20.5 4.5" stroke="#5e6068" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

/** 3 — the mark reached: the lid off its seat, light out of the gap. */
function OpenGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <rect x="7" y="14" width="20" height="14" fill="none" stroke="#93959d" strokeWidth="1.6" />
      <rect x="9" y="17" width="16" height="9" fill="#ffffff" opacity="0.75" />
      <rect x="5" y="10" width="24" height="1.8" fill="#ffffff" />
      <rect x="7" y="5" width="20" height="4" fill="none" stroke="#93959d" strokeWidth="1.6" />
    </svg>
  );
}

/** 4 — the split: one stream, two destinations, evenly. */
function SplitGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden fill="none">
      <path d="M17 4 V13" stroke="#ffffff" strokeWidth="1.8" />
      <path d="M17 13 C17 20, 8 19, 8 26" stroke="#93959d" strokeWidth="1.6" />
      <path d="M17 13 C17 20, 26 19, 26 26" stroke="#93959d" strokeWidth="1.6" />
      <rect x="4" y="26" width="8" height="4" fill="#93959d" />
      <rect x="22" y="26" width="8" height="4" fill="#93959d" />
    </svg>
  );
}

const steps = [
  {
    index: "1",
    title: "Somebody trades",
    body: `Every buy and every sell of ${siteConfig.ticker} pays a ${FEE_PCT}% fee. Buys and sells both — the box does not care which direction you went.`,
    Glyph: TradeGlyph,
  },
  {
    index: "2",
    title: "The fee goes in the box",
    body: "All of it, straight in. There is no treasury split, no team cut taken off the top on the way past, and no way to withdraw from the box before it opens.",
    Glyph: FillGlyph,
  },
  {
    index: "3",
    title: "A mark is reached",
    body: "Four marks are set on the box. The moment what is inside touches one, the lid opens on its own — nobody presses anything and nobody chooses when.",
    Glyph: OpenGlyph,
  },
  {
    index: "4",
    title: "It empties, both ways",
    body: `${BUYBACK_PCT}% buys ${siteConfig.ticker} back off the open market. ${HOLDER_PCT}% is paid straight out to holders. The box reseals empty and starts on the next mark.`,
    Glyph: SplitGlyph,
  },
] as const;

export function Mechanic() {
  return (
    <section
      id="mechanic"
      className="scroll-mt-16 border-b border-edge px-4 py-16 sm:px-6 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <Label className="mb-3 block">The mechanic</Label>
        <h2 className="type-display text-chalk">One box, one rule</h2>
        <p className="type-body mt-4 mb-12 max-w-[62ch] text-chalk-soft">
          There is nothing else to learn. The fee is fixed, the destination is
          fixed, the split is fixed, and the only thing that changes from one
          opening to the next is how much it takes to trigger the following one.
        </p>

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map(({ index, title, body, Glyph }) => (
            <li key={index} className="border-t border-edge pt-6">
              <Plate>
                <Glyph />
              </Plate>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="type-label text-chalk-muted">{index}</span>
                <h3 className="type-title text-chalk">{title}</h3>
              </div>

              <p className="type-body mt-3 max-w-[38ch] text-chalk-soft">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
