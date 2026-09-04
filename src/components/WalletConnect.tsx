"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/Button";
import { boxChain } from "@/lib/chain";

function short(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/*
 * Connect, and nothing else.
 *
 * There is no buy button anywhere on this site, because there is nothing to
 * buy yet and a disabled one would only invite the question. Connecting early
 * is the one thing a visitor can actually do, and the wrong-network prompt is
 * here so that when trading does open, the wallet is already pointed at the
 * chain the box is on.
 */
export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const injected = connectors[0];
  const wrongChain = isConnected && chainId !== boxChain.id;

  if (wrongChain) {
    return (
      <Button onClick={() => switchChain({ chainId: boxChain.id })}>
        Switch to {boxChain.name}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <Button variant="quiet" onClick={() => disconnect()} title="Disconnect">
        {short(address)}
      </Button>
    );
  }

  return (
    <Button
      onClick={() => injected && connect({ connector: injected })}
      disabled={!injected || isPending}
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
