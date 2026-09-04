/*
 * The marks on the box.
 *
 * Four of them, and they escalate. That escalation is the only thing that
 * changes between openings — the split never does — because a mechanic with
 * one rule and a rising bar is something a stranger can repeat to somebody
 * else after reading the page once, and a mechanic with four different rules
 * is not.
 *
 * The ladder is deliberately steep at the top. Mark I has to be reachable in
 * days or the box is a monument to nothing; mark IV has to be far enough away
 * that clearing it is an event.
 */
export interface Threshold {
  /** Roman numeral. The marks are numbered, never named. */
  mark: string;
  /** What the box must hold, in USD, before the lid moves. */
  amountUsd: number;
}

export const thresholds: readonly Threshold[] = [
  { mark: "I", amountUsd: 10_000 },
  { mark: "II", amountUsd: 25_000 },
  { mark: "III", amountUsd: 50_000 },
  { mark: "IV", amountUsd: 100_000 },
] as const;

/**
 * Where a mark sits on the rail beside the box.
 *
 * The marks are drawn against the *largest* threshold, not against the
 * current one, so the ladder keeps its shape as the box climbs it. Mark I
 * sitting a tenth of the way up the glass is the honest picture: the first
 * opening is a long way below the last one, and the rail should say so.
 */
export const CEILING_USD = thresholds[thresholds.length - 1].amountUsd;

export function railPosition(amountUsd: number): number {
  return amountUsd / CEILING_USD;
}

/** The mark the box is currently filling toward, or null once IV is cleared. */
export function nextThreshold(cleared: number): Threshold | null {
  return thresholds[cleared] ?? null;
}
