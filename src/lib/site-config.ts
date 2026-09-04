/*
 * The name lives here and nowhere else. `name` is the all-caps lockup used in
 * metadata, the nav and the OG image; `wordmark` is the title-case form; the
 * ticker is derived from it. Renaming the project means editing these three
 * strings and nothing in any component.
 */
export const siteConfig = {
  name: "BLACKBOXR",
  wordmark: "Blackboxr",
  ticker: "$BOXR",
  tagline: "Every trade fills the box.",
  description:
    "Every trade pays a fee. Every fee goes into the box. When the box reaches a mark, it opens — half buys the token back off the market, half goes to the people holding it.",
  seoDescription:
    "A sealed box that fills with trading fees. At four marked levels it opens: half buyback, half paid to holders.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackboxr.example",
  /**
   * The project's account. Defaulted rather than left null because it exists
   * and is the one place a visitor can actually go before launch — the env var
   * stays as an override so a fork or a staging deploy can point elsewhere.
   */
  x: process.env.NEXT_PUBLIC_BLACKBOXR_X ?? "https://x.com/Blackboxr_xyz",
  telegram: process.env.NEXT_PUBLIC_BLACKBOXR_TELEGRAM ?? null,
} as const;

function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value : null;
}

/**
 * The fee that fills the box, in basis points of each trade. A design
 * parameter of the mechanic rather than a reading off the chain, so it is
 * stated rather than gated — but it is overridable, because the number the
 * site quotes and the number the contract charges must never drift apart.
 */
export const FEE_BPS = Number(process.env.NEXT_PUBLIC_BLACKBOXR_FEE_BPS ?? 200);

/** Share of every opening spent buying $BOXR back off the market. */
export const BUYBACK_SHARE = 0.5;

/**
 * Trading surface. Address-driven exactly like the fill figure: with no
 * contract set, the box reads zero, the counter is honest about it, and
 * nothing on the page claims a trade has ever happened.
 */
export const boxContract = {
  address: envOrNull(
    process.env.NEXT_PUBLIC_BLACKBOXR_CONTRACT_ADDRESS,
  ) as `0x${string}` | null,
  isLive: process.env.NEXT_PUBLIC_BLACKBOXR_LIVE === "true",
} as const;

/** True only when there is a real contract to read the box's contents from. */
export const isLive = boxContract.isLive && boxContract.address !== null;
