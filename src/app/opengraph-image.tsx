import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { thresholds } from "@/lib/thresholds";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The share card is the object, not a logo lockup: a box on the right with
 * its seam lit, the sentence on the left. Satori has no filters, so the glow
 * is built from stacked box-shadows rather than a blur.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#050506",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#5e6068",
              letterSpacing: 8,
            }}
          >
            {siteConfig.name} · {siteConfig.ticker}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 78,
              lineHeight: 1.02,
              color: "#d9dbe0",
              letterSpacing: -2,
            }}
          >
            Every trade fills the box.
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 25,
              color: "#93959d",
            }}
          >
            {thresholds.length} marks. Half buyback, half to holders.
          </div>
        </div>

        {/* The box. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            height: 340,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 74,
              background: "#15161a",
              border: "1px solid #2b2e34",
            }}
          />
          <div
            style={{
              display: "flex",
              height: 4,
              background: "#ffffff",
              boxShadow:
                "0 0 24px 6px rgba(219,233,255,0.55), 0 0 60px 18px rgba(150,180,220,0.28)",
            }}
          />
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
              background: "#0b0b0d",
              border: "1px solid #232529",
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                height: 96,
                background: "#c9dcf5",
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
