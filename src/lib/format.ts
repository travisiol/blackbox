const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number): string {
  return usd.format(value);
}

/**
 * The counter's own format. Cents are kept because the box is filled by
 * individual trades and a readout that only moves in whole dollars would sit
 * still through most of them — the small digits are what prove it is live.
 */
export function formatCounter(value: number): string {
  return usdCents.format(value);
}
