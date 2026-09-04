"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "#mechanic", label: "Mechanic" },
  { href: "#marks", label: "Marks" },
  { href: "#ledger", label: "Ledger" },
  { href: "#faq", label: "Questions" },
] as const;

/*
 * The wordmark carries its own seal: a small filled square, the box seen
 * end-on. It is the only mark the project has, and it is the same shape as
 * the thing on the page below it.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="h-3 w-3 border border-edge-strong bg-void-deep"
          />
          <span className="type-label text-chalk">{siteConfig.name}</span>
          <span className="type-label hidden text-chalk-muted sm:inline">
            {siteConfig.ticker}
          </span>
        </a>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="type-label text-chalk-muted transition-colors hover:text-chalk"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* The account sits up here as well as in the footer: before launch it
            is the only place a visitor can actually go, and a link that only
            exists at the bottom of a long page is barely on the site. */}
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          {siteConfig.x && (
            <a
              href={siteConfig.x}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${siteConfig.name} on X`}
              className="text-chalk-muted transition-colors hover:text-chalk"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
