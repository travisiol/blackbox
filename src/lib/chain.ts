import { base } from "viem/chains";
import { defineChain } from "viem";

/*
 * Where the box lives.
 *
 * Base is the default because it is where fee-driven tokens of this shape
 * actually trade, but nothing in the site hardcodes it: set
 * NEXT_PUBLIC_BLACKBOXR_CHAIN_ID and the matching RPC and the whole app —
 * wallet prompts, explorer links, the FAQ answer — follows. The chain the
 * site names and the chain the contract is on must never be two decisions.
 */
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_BLACKBOXR_CHAIN_ID ?? base.id);
const RPC_URL = process.env.NEXT_PUBLIC_BLACKBOXR_RPC_URL;

export const boxChain =
  CHAIN_ID === base.id && !RPC_URL
    ? base
    : defineChain({
        ...base,
        id: CHAIN_ID,
        name: process.env.NEXT_PUBLIC_BLACKBOXR_CHAIN_NAME ?? base.name,
        rpcUrls: {
          default: { http: [RPC_URL ?? base.rpcUrls.default.http[0]] },
        },
      });

export const explorerUrl =
  boxChain.blockExplorers?.default.url ?? "https://basescan.org";
