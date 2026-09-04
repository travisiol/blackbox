import { createConfig, http, injected } from "wagmi";
import { boxChain } from "@/lib/chain";

export const wagmiConfig = createConfig({
  chains: [boxChain],
  connectors: [injected()],
  transports: {
    [boxChain.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
