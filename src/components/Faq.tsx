import { Label } from "@/components/ui/Label";
import { formatUsd } from "@/lib/format";
import { boxChain } from "@/lib/chain";
import { BUYBACK_SHARE, FEE_BPS, isLive, siteConfig } from "@/lib/site-config";
import { thresholds } from "@/lib/thresholds";

const FEE_PCT = FEE_BPS / 100;
const BUYBACK_PCT = Math.round(BUYBACK_SHARE * 100);
const HOLDER_PCT = 100 - BUYBACK_PCT;

/*
 * Written against the objections, in the order a sceptical reader has them.
 *
 * The name question goes first because it is the one that stops somebody at
 * the door: "black box" is an accusation in finance, and a project called
 * BLACKBOXR that dodges the question deserves to be dismissed. The late-buyer
 * question is answered honestly rather than dressed up — the mechanic does
 * not prevent it, saying otherwise would be a lie, and the reason it is
 * survivable is more interesting than a denial would have been.
 */
const entries = [
  {
    q: "Why call it a black box if I have to trust it?",
    a: "Because only the outside is black. A black box in finance means you cannot see the workings, and that is exactly what this is not: the fee is fixed in the contract, the marks are set in the contract, the split is set in the contract, and the amount inside is a public number you can read yourself at any moment. What the box hides is nothing. What it does is hold — visibly, without anyone able to reach in.",
  },
  {
    q: "Can the team take money out of the box?",
    a: "The box has no withdraw function and no owner-only path out of it. The only way anything leaves is a mark being reached, and when that happens the contract splits it and sends it — there is no step in the middle where a person decides anything. If that is not what the deployed contract turns out to say, none of this page is worth reading, so check it.",
  },
  {
    q: "Is this a lottery?",
    a: "No. Nothing about an opening is random and nobody wins it. The marks are published numbers, the split is always the same, and the payout goes to every holder in proportion to what they hold. There is no draw, no ticket, and no winner — just a threshold and an automatic release.",
  },
  {
    q: "Who decides when it opens?",
    a: "Nobody. It opens when what is inside touches the mark, and that is the entire condition. There is no vote, no multisig, no announcement, and no discretion. The box is not managed — it is triggered.",
  },
  {
    q: "Can someone buy just before an opening to catch the payout?",
    a: `Yes, and the design does not pretend otherwise. Everyone can watch the counter climb, so a late buyer can see a mark coming. Two things blunt it. Their own buy pays the ${FEE_PCT}% fee, which goes straight into the very box they are trying to catch. And the ${BUYBACK_PCT}% of every opening spent buying ${siteConfig.ticker} back does not care who is holding — it works on the market itself. The alternative, a secret snapshot nobody could verify, would fix the sniping by making the whole thing unauditable, which is a worse trade.`,
  },
  {
    q: "What if the box never reaches a mark?",
    a: "Then it sits there, sealed, with the fees still inside it. Nothing expires, nothing is lost, and nothing is released early. A box that fills slowly opens later; a box that stops filling stops. The counter would simply stop moving, in public, and you would be able to see that as clearly as you can see it move.",
  },
  {
    q: "How is the holder payout worked out?",
    a: `${HOLDER_PCT}% of what the box held is divided across holders in proportion to how much ${siteConfig.ticker} each one holds when the box opens. Hold one percent of the supply and you receive one percent of that half. There is no tier, no lock-up and no minimum.`,
  },
  {
    q: "What does the buyback actually do?",
    a: `${BUYBACK_PCT}% of every opening is spent buying ${siteConfig.ticker} on the open market. That is real demand arriving at whatever the price is at that moment, funded entirely by fees that have already been paid. It is the half of the mechanic that reaches every holder at once, including the ones who were not watching.`,
  },
  {
    q: "Do sells pay the fee too?",
    a: `Yes. Every trade in either direction pays ${FEE_PCT}%, and all of it goes into the box. A sell fills the box exactly as much as a buy of the same size does — which is the point of "every trade fills the box" rather than "every buy".`,
  },
  {
    q: "Why do the marks get bigger?",
    a: `So that the first one is reachable and the last one is an occasion. Mark I opens at ${formatUsd(thresholds[0].amountUsd)} because a box that took a year to open the first time would never open at all. Mark IV opens at ${formatUsd(thresholds[thresholds.length - 1].amountUsd)} because by then there is enough trading to reach it, and because the box should get harder, not easier, as it goes.`,
  },
  {
    q: "What happens after mark IV?",
    a: "The box is retired and a new one is sealed with the next serial, starting again at mark I. The serial is on the lid — the box on this page is numbered, and so is every box that came before it.",
  },
  {
    q: "Which chain is this on?",
    a: `${boxChain.name}. Connect any injected wallet and the site will prompt you to switch if you are on a different network.`,
  },
  {
    q: "Is anything on this page live yet?",
    a: isLive
      ? "Yes. The counter, the marks and the ledger are read from the contract."
      : "No. Nothing has traded, no box has filled and no box has opened. What you can see moving at the top of the page is a preview of the mechanic, running so that the object does something rather than sitting at zero — those figures are generated in your browser, they are not read off any chain, and you can stop it with the control under the pitch. The moment there is a contract, the same counter reads from it and the preview is gone.",
  },
] as const;

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-16 border-b border-edge px-4 py-16 sm:px-6 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <Label className="mb-3 block">Questions</Label>
        <h2 className="type-display mb-12 text-chalk">Before you buy</h2>

        <dl className="grid grid-cols-1 gap-x-14 gap-y-9 md:grid-cols-2">
          {entries.map((entry) => (
            <div key={entry.q} className="border-t border-edge pt-5">
              <dt className="type-title text-chalk">{entry.q}</dt>
              <dd className="type-body mt-3 max-w-[56ch] text-chalk-soft">
                {entry.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
