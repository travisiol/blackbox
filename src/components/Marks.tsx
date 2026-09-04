import { Label } from "@/components/ui/Label";
import { formatUsd } from "@/lib/format";
import { BUYBACK_SHARE, siteConfig } from "@/lib/site-config";
import { thresholds } from "@/lib/thresholds";

const BUYBACK_PCT = Math.round(BUYBACK_SHARE * 100);
const HOLDER_PCT = 100 - BUYBACK_PCT;

const CYCLE_TOTAL = thresholds.reduce(
  (total, threshold) => total + threshold.amountUsd,
  0,
);

/*
 * The ladder written out with its arithmetic done.
 *
 * The hero shows where the box is; this shows where it is going and what each
 * stop is worth. The cumulative column is the one that earns the section — a
 * reader who only sees "mark I: $10,000" underrates the mechanic badly, and
 * the honest answer to "so what does a full cycle actually move" is a number
 * worth putting on the page.
 */
export function Marks() {
  return (
    <section
      id="marks"
      className="scroll-mt-16 border-b border-edge px-4 py-16 sm:px-6 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <Label className="mb-3 block">The marks</Label>
        <h2 className="type-display text-chalk">Four stops, then a new box</h2>
        <p className="type-body mt-4 mb-12 max-w-[62ch] text-chalk-soft">
          Every opening splits the same way — {BUYBACK_PCT}% buyback,{" "}
          {HOLDER_PCT}% to holders. The only thing that escalates is the size
          of the box it takes to get there. Clearing mark IV retires the box,
          seals a new one with the next serial, and the ladder starts again
          at I.
        </p>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-edge-strong">
                <th scope="col" className="type-label py-3 pr-4 text-chalk-muted">
                  Mark
                </th>
                <th scope="col" className="type-label py-3 pr-4 text-chalk-muted">
                  Opens at
                </th>
                <th scope="col" className="type-label py-3 pr-4 text-chalk-muted">
                  Buys back
                </th>
                <th scope="col" className="type-label py-3 pr-4 text-chalk-muted">
                  To holders
                </th>
                <th scope="col" className="type-label py-3 text-chalk-muted">
                  Through this mark
                </th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((threshold, index) => {
                const cumulative = thresholds
                  .slice(0, index + 1)
                  .reduce((total, entry) => total + entry.amountUsd, 0);

                return (
                  <tr key={threshold.mark} className="border-b border-edge">
                    <td className="type-figure py-4 pr-4 text-chalk">
                      {threshold.mark}
                    </td>
                    <td className="type-data py-4 pr-4 text-chalk">
                      {formatUsd(threshold.amountUsd)}
                    </td>
                    <td className="type-data py-4 pr-4 text-chalk-soft">
                      {formatUsd(threshold.amountUsd * BUYBACK_SHARE)}
                    </td>
                    <td className="type-data py-4 pr-4 text-chalk-soft">
                      {formatUsd(threshold.amountUsd * (1 - BUYBACK_SHARE))}
                    </td>
                    <td className="type-data py-4 text-chalk-muted">
                      {formatUsd(cumulative)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="type-body mt-8 max-w-[62ch] text-chalk-soft">
          A complete cycle — mark I through mark IV — moves{" "}
          <span className="text-chalk">{formatUsd(CYCLE_TOTAL)}</span> of fees
          through the box:{" "}
          {formatUsd(CYCLE_TOTAL * BUYBACK_SHARE)} of {siteConfig.ticker} bought
          back off the market, and {formatUsd(CYCLE_TOTAL * (1 - BUYBACK_SHARE))}{" "}
          paid out to the people holding it.
        </p>
      </div>
    </section>
  );
}
