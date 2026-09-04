/*
 * The interface the site expects of the box contract.
 *
 * Nothing calls this yet — with no address configured there is nothing to
 * call — but writing it down first fixes the shape the contract has to meet,
 * and means wiring the site to a deployment is a matter of setting an address
 * rather than reworking the front end.
 *
 * Three reads and one event is the entire surface. The site deliberately does
 * not ask the contract for a price, a market cap or a holder count: every
 * figure on the page is either the box's own contents or a constant of the
 * mechanic, and keeping it that way is what stops the page from ever showing
 * a number it cannot prove.
 */
export const blackboxrAbi = [
  {
    type: "function",
    name: "filled",
    stateMutability: "view",
    inputs: [],
    /** Fees currently held, in the box's accounting token, 18 decimals. */
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "cleared",
    stateMutability: "view",
    inputs: [],
    /** Marks cleared by the current box: 0 through 4. */
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "serial",
    stateMutability: "view",
    inputs: [],
    /** Which box this is. Increments when mark IV is cleared. */
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "event",
    name: "Opened",
    inputs: [
      { name: "serial", type: "uint32", indexed: true },
      { name: "mark", type: "uint8", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "boughtBack", type: "uint256", indexed: false },
      { name: "distributed", type: "uint256", indexed: false },
    ],
  },
] as const;
