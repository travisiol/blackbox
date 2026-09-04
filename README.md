# BLACKBOXR

> Every trade fills the box.

A one-page site for a token with a single mechanic: every trade pays a fee,
every fee goes into one sealed box, and at four marked levels the box opens —
half buys the token back off the market, half is paid to holders. Then it
reseals, empty, and the next mark is higher.

## The mechanic in one place

| | |
| --- | --- |
| Fee | `NEXT_PUBLIC_BLACKBOXR_FEE_BPS`, default 200 bps (2%), on buys **and** sells |
| Destination | 100% into the box. No treasury split on the way past. |
| Marks | $10,000 · $25,000 · $50,000 · $100,000 — `src/lib/thresholds.ts` |
| Split at every opening | 50% buyback / 50% to holders — `BUYBACK_SHARE` |
| After mark IV | Box retired, new serial sealed, ladder restarts at I |

A full cycle moves $185,000 of fees through the box.

## Nothing on the page is invented

The site ships pre-launch and says so. With no contract address configured:

- the page is tagged **"awaiting launch"**
- the box runs a **preview of the mechanic on load** — it fills, opens at a
  mark, and starts again — so the object does something instead of sitting at
  zero
- every figure that preview produces is generated **in the browser**, and the
  page says so in three places: the line directly under the hero controls, the
  **Stop the preview** control itself, and the chip on the ledger reading
  "simulated — no box has opened yet"
- stopping the preview returns the site to the true state: counter at zero,
  box sealed, ledger empty

That control exists to solve a real problem — an empty box is a weak hero on
day one — without the usual fix of seeding the page with volume that never
happened. See the comment at the top of `src/components/Hero.tsx`.

## Going live

Set the contract address and flip the flag:

```bash
NEXT_PUBLIC_BLACKBOXR_CONTRACT_ADDRESS=0x…
NEXT_PUBLIC_BLACKBOXR_LIVE=true
```

`src/lib/blackboxrAbi.ts` is the interface the front end expects: three views
(`filled`, `cleared`, `serial`) and one `Opened` event, which is everything
the ledger needs. Nothing is wired to it yet — `isLive` gates every claim the
page makes, and the reads are the one piece left to add once a deployment
exists.

Two numbers must match the contract exactly or the page is lying:
`NEXT_PUBLIC_BLACKBOXR_FEE_BPS` and the ladder in `src/lib/thresholds.ts`.

## Design

The rule is in the header comment of `src/app/globals.css` and it is worth
keeping: **pure white is the light inside the box and nothing else.** Headings
top out at `--chalk` (#d9dbe0). There is no accent hue anywhere, because a
vault is not a brand with a colour — it is a mass in the dark with something
glowing inside it, and a second bright thing on the page would immediately
stop the box being the subject.

The box itself is `src/components/Box.tsx`: hand-drawn SVG, no 3D library, no
assets. Everything it does is driven by one number (`progress`, 0 to 1) and
one CSS custom property (`--fill`).

## Running it

```bash
npm install
npm run dev
```

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4,
wagmi + viem.
