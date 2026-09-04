import { boxContract, siteConfig } from "@/lib/site-config";
import { explorerUrl } from "@/lib/chain";
import { Label } from "@/components/ui/Label";

const socials = [
  { href: siteConfig.x, label: "X" },
  { href: siteConfig.telegram, label: "Telegram" },
].filter((social): social is { href: string; label: string } =>
  Boolean(social.href),
);

/*
 * The contract address is the last thing on the page on purpose: it is the
 * only line here that can be checked, and "not deployed yet" is a better
 * footer than a placeholder address that looks like one.
 */
export function Footer() {
  return (
    <footer className="px-4 py-14 sm:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-3 w-3 border border-edge-strong bg-void-deep"
              />
              <span className="type-label text-chalk">{siteConfig.name}</span>
              <span className="type-label text-chalk-muted">
                {siteConfig.ticker}
              </span>
            </div>
            <p className="type-body mt-4 max-w-[42ch] text-chalk-soft">
              {siteConfig.tagline}
            </p>
          </div>

          {socials.length > 0 && (
            <nav className="flex gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="type-label text-chalk-muted transition-colors hover:text-chalk"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {social.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="border-t border-edge pt-6">
          <Label className="mb-2 block">Contract</Label>
          {boxContract.address ? (
            <a
              href={`${explorerUrl}/address/${boxContract.address}`}
              rel="noreferrer noopener"
              target="_blank"
              className="type-data break-all text-chalk-soft underline decoration-edge-strong underline-offset-4 transition-colors hover:text-chalk"
            >
              {boxContract.address}
            </a>
          ) : (
            <p className="type-data text-chalk-muted">
              Not deployed yet. This line becomes the address the moment there
              is one.
            </p>
          )}

          <p className="type-data mt-6 max-w-[76ch] text-chalk-muted">
            {siteConfig.ticker} is a token with a fee mechanic, not an
            investment product, and nothing on this page is financial advice.
            The value of a token can go to zero. Read the contract before you
            buy anything.
          </p>
        </div>
      </div>
    </footer>
  );
}
