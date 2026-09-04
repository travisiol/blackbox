"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isLive } from "@/lib/site-config";
import { thresholds, type Threshold } from "@/lib/thresholds";

/*
 * What the box is doing.
 *
 * "sealed" is the truth before launch and the truth between trades: a shut
 * box with a number on it. "filling" is a box taking fees. "opening" is the
 * few seconds the lid is up. There is no fourth state, because the box has no
 * other behaviour — that narrowness is the product.
 *
 * Note that this is derived, never stored. The box is open precisely when
 * what is inside it has reached the mark, so holding that as its own piece of
 * state would be keeping a second copy of a fact the numbers already carry —
 * and the two copies would eventually disagree.
 */
export type BoxStatus = "sealed" | "filling" | "opening";

export interface Opening {
  /** Which box it was, and which mark it cleared. */
  serial: number;
  mark: string;
  amountUsd: number;
}

interface BoxState {
  /** USD sitting in the box right now. */
  filled: number;
  /** Marks cleared in this box's life, 0 through 3. */
  cleared: number;
  /** The box's serial. A new one is sealed each time the last mark is cleared. */
  serial: number;
  status: BoxStatus;
  target: Threshold;
  /** 0 to 1 against the current mark — what the glass shows. */
  progress: number;
  /** Every opening so far. Empty until something has actually opened. */
  openings: Opening[];
  /**
   * True while the simulation is driving the numbers rather than a chain.
   * Starts true whenever there is no live contract to read instead.
   */
  isSimulating: boolean;
  /** Live contract wired up? Gates every claim the page makes. */
  isLive: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const BoxContext = createContext<BoxState | null>(null);

/** How long one mark takes to fill in the simulation, in ms. */
const FILL_MS = 7_000;
const TICK_MS = 90;
/** The lid animation in globals.css runs 2600ms; this must outlast it. */
const OPEN_MS = 2_800;

/**
 * A trade-sized bite out of the remaining distance.
 *
 * The tail matters more than the mean here. Fees arrive as discrete trades of
 * wildly different sizes, so a counter that climbs by an even amount every
 * tick looks like a loading bar and not like a market. Most ticks are small;
 * one in ten is several times the size.
 */
function tradeSize(perTick: number): number {
  const roll = Math.random();
  const weight = roll > 0.9 ? 3 + Math.random() * 3 : 0.2 + Math.random() * 1.1;
  return perTick * weight;
}

export function BoxStateProvider({ children }: { children: ReactNode }) {
  const [filled, setFilled] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [serial, setSerial] = useState(1);
  const [openings, setOpenings] = useState<Opening[]>([]);

  /*
   * The preview runs on arrival rather than waiting to be asked. An empty box
   * is a weak first impression, and the whole point of the object is that it
   * moves — a visitor who never presses anything should still see it work.
   *
   * `isLive` is resolved from env at build time, so this initialiser produces
   * the same value on the server and on the client and cannot desync at
   * hydration. It is deliberately NOT set from an effect: that would render
   * one frame of a dead box before the first tick.
   *
   * Running by default puts the weight of the disclosure on the copy instead
   * of on the visitor's own click, which is why the line under the controls
   * says outright that the figures are generated in the browser, why the stop
   * control stays visible, and why the ledger marks its rows simulated. The
   * stop control is also what keeps an auto-running readout acceptable for
   * anyone who does not want moving content on the page.
   */
  const [isSimulating, setIsSimulating] = useState(!isLive);

  const target = thresholds[Math.min(cleared, thresholds.length - 1)];
  const isOpen = filled >= target.amountUsd;

  const status: BoxStatus = isOpen
    ? "opening"
    : isSimulating
      ? "filling"
      : "sealed";

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    setFilled(0);
    setCleared(0);
    setSerial(1);
    setOpenings([]);
  }, []);

  const startSimulation = useCallback(() => {
    setFilled(0);
    setCleared(0);
    setSerial(1);
    setOpenings([]);
    setIsSimulating(true);
  }, []);

  /*
   * Trades arriving. `target` is a real dependency rather than something read
   * out of a ref, which costs nothing: it only changes at an opening, and the
   * interval is being torn down at that moment anyway.
   */
  useEffect(() => {
    if (!isSimulating || isOpen) return;

    const perTick = target.amountUsd / (FILL_MS / TICK_MS);

    const timer = window.setInterval(() => {
      setFilled((current) =>
        Math.min(current + tradeSize(perTick), target.amountUsd),
      );
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [isSimulating, isOpen, target]);

  /*
   * The lid is up. Hold it there long enough for the animation to land, then
   * record what came out, empty the box and move the ladder on.
   *
   * The cleanup matters: stopping the simulation mid-opening cancels the
   * timer, so a cancelled cycle never writes a row into the ledger.
   */
  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      setOpenings((current) => [
        { serial, mark: target.mark, amountUsd: target.amountUsd },
        ...current,
      ]);
      setFilled(0);

      // Clearing the last mark retires the box and seals a fresh one.
      if (cleared + 1 >= thresholds.length) {
        setCleared(0);
        setSerial((previous) => previous + 1);
      } else {
        setCleared(cleared + 1);
      }
    }, OPEN_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, cleared, serial, target]);

  const value = useMemo<BoxState>(
    () => ({
      filled,
      cleared,
      serial,
      status,
      target,
      progress: Math.min(filled / target.amountUsd, 1),
      openings,
      isSimulating,
      isLive,
      startSimulation,
      stopSimulation,
    }),
    [
      filled,
      cleared,
      serial,
      status,
      target,
      openings,
      isSimulating,
      startSimulation,
      stopSimulation,
    ],
  );

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
}

export function useBox(): BoxState {
  const state = useContext(BoxContext);
  if (!state) throw new Error("useBox must be used inside BoxStateProvider");
  return state;
}
