"use client";

import { clsx } from "clsx";

/*
 * The box.
 *
 * Drawn rather than modelled, and drawn straight on. A perspective cube would
 * have been easier to make look expensive and much worse at the job: seen
 * head-on with only a shallow top face, this reads as a thing standing in
 * front of you at eye level, and the fill line stays perfectly horizontal —
 * which is what lets a glance at it be a reading rather than an impression.
 *
 * Four materials, no more: milled shell, smoked glass, light, and the gap
 * between the lid and the body. The gap is the important one. It is the only
 * part of the object that changes without being asked to, and it is where all
 * the tension lives — a sealed box that is visibly getting brighter along one
 * seam is a box about to do something.
 */

const GLASS = { x: 66, y: 148, w: 208, h: 138 } as const;

export function Box({
  progress,
  isOpening,
  serial,
}: {
  /** 0 to 1 against the mark the box is currently filling toward. */
  progress: number;
  isOpening: boolean;
  serial: number;
}) {
  const drop = (1 - Math.min(Math.max(progress, 0), 1)) * GLASS.h;

  return (
    <div
      className={clsx("box-stage relative w-full", isOpening && "is-opening")}
      style={{ "--fill": progress } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 340 330"
        className="w-full"
        role="img"
        aria-label={`Box number ${serial}, ${Math.round(progress * 100)} percent of the way to its next mark`}
      >
        <defs>
          {/* The room light falling on the top face. */}
          <linearGradient id="bx-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25272c" />
            <stop offset="100%" stopColor="#111216" />
          </linearGradient>

          {/* Shell front: lighter at the top edge, falling into black. */}
          <linearGradient id="bx-shell" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1b1f" />
            <stop offset="45%" stopColor="#0d0e11" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>

          <linearGradient id="bx-lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2024" />
            <stop offset="100%" stopColor="#0a0b0d" />
          </linearGradient>

          {/*
           * The contents. A hot 3% band at the very top is the meniscus — it
           * comes free with the gradient and always sits exactly at the
           * surface, however far the mass has been translated.
           */}
          <linearGradient id="bx-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="3%" stopColor="#e8f1ff" stopOpacity="0.78" />
            <stop offset="26%" stopColor="#c9dcf5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8fb2d8" stopOpacity="0.16" />
          </linearGradient>

          {/* One specular streak. Glass with no highlight is just a hole. */}
          <linearGradient id="bx-spec" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.015" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="bx-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#dbe9ff" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#a9c6ea" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7f9fc4" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="bx-seam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          <clipPath id="bx-glass-clip">
            <rect
              x={GLASS.x}
              y={GLASS.y}
              width={GLASS.w}
              height={GLASS.h}
              rx="2"
            />
          </clipPath>

          <filter id="bx-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          <filter id="bx-seam-blur" x="-40%" y="-400%" width="180%" height="900%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ---- Ambient halo. Grows with the contents. -------------------
            Sized to die out exactly at the bottom of the viewBox: a radial
            glow clipped by the edge of the canvas shows a hard line, which
            is the one thing a glow must never have. */}
        <ellipse
          className="seam-glow"
          cx="170"
          cy="196"
          rx="180"
          ry="134"
          fill="url(#bx-halo)"
        />

        {/* ---- Plinth --------------------------------------------------- */}
        <rect x="36" y="300" width="268" height="11" fill="#0a0b0d" />
        <rect x="36" y="300" width="268" height="1" fill="rgba(255,255,255,0.13)" />
        <rect x="46" y="311" width="248" height="5" fill="#050506" />

        {/* The light the box throws on its own plinth. */}
        <ellipse
          className="seam-glow"
          cx="170"
          cy="308"
          rx="120"
          ry="9"
          fill="#cfe1fb"
          opacity="0.18"
          filter="url(#bx-soft)"
        />

        {/* ---- Body ----------------------------------------------------- */}
        <rect x="50" y="134" width="240" height="166" fill="url(#bx-shell)" />
        <rect x="50" y="134" width="240" height="166" fill="none" stroke="rgba(255,255,255,0.07)" />

        {/* Glass well: the recess the contents sit in, then the pane. */}
        <rect
          x={GLASS.x}
          y={GLASS.y}
          width={GLASS.w}
          height={GLASS.h}
          rx="2"
          fill="#000000"
        />

        <g clipPath="url(#bx-glass-clip)">
          {/* The contents. One transform, driven by `progress`. */}
          <g
            className="fill-mass"
            style={{ transform: `translateY(${drop}px)` }}
          >
            <rect
              x={GLASS.x}
              y={GLASS.y}
              width={GLASS.w}
              height={GLASS.h + 6}
              fill="url(#bx-fill)"
            />
            {/* Glow sitting on the surface, so the meniscus reads as lit
                rather than as the edge of a shape. */}
            <ellipse
              className="animate-swell"
              cx="170"
              cy={GLASS.y + 2}
              rx="118"
              ry="14"
              fill="#eaf3ff"
              opacity="0.5"
              filter="url(#bx-soft)"
            />
          </g>

          {/* Inner shadow along the top of the well. Kept light: at a full box
              the meniscus sits right under here, and that is the one frame the
              whole mechanic is building toward. */}
          <rect
            x={GLASS.x}
            y={GLASS.y}
            width={GLASS.w}
            height="22"
            fill="url(#bx-shell)"
            opacity="0.6"
          />
          {/* The pane itself, over everything inside it. */}
          <rect
            x={GLASS.x}
            y={GLASS.y}
            width={GLASS.w}
            height={GLASS.h}
            fill="rgba(255,255,255,0.022)"
          />
          <polygon
            points={`${GLASS.x},${GLASS.y} ${GLASS.x + 96},${GLASS.y} ${GLASS.x + 28},${GLASS.y + GLASS.h} ${GLASS.x},${GLASS.y + GLASS.h}`}
            fill="url(#bx-spec)"
          />
        </g>

        <rect
          x={GLASS.x}
          y={GLASS.y}
          width={GLASS.w}
          height={GLASS.h}
          rx="2"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
        />

        {/* Bolts. Four, because a box with two looks like a drawing of a box. */}
        {[
          [60, 144],
          [280, 144],
          [60, 290],
          [280, 290],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="3.2" fill="#0a0b0d" />
            <circle
              cx={cx}
              cy={cy}
              r="3.2"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />
            <circle cx={cx} cy={cy - 0.8} r="1" fill="rgba(255,255,255,0.16)" />
          </g>
        ))}

        {/* ---- Lid ------------------------------------------------------ */}
        <g className="box-lid">
          {/* Top face. The only surface in the whole scene lit from outside. */}
          <polygon points="50,84 290,84 268,60 72,60" fill="url(#bx-top)" />
          <polygon
            points="50,84 290,84 268,60 72,60"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
          />
          <line x1="72" y1="60" x2="268" y2="60" stroke="rgba(255,255,255,0.24)" />

          <rect x="50" y="84" width="240" height="48" fill="url(#bx-lid)" />
          <rect x="50" y="84" width="240" height="1" fill="rgba(255,255,255,0.16)" />
          <rect
            x="50"
            y="84"
            width="240"
            height="48"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
          />

          {/* The serial, struck into the lid. */}
          <text
            x="170"
            y="114"
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              letterSpacing: "0.34em",
            }}
          >
            N&#186;&#8202;{String(serial).padStart(3, "0")}
          </text>
        </g>

        {/* ---- The seam ------------------------------------------------- */}
        {/* Bloom first, hard line over it: the order is what makes it look
            like light escaping rather than a stroke with a shadow. */}
        <rect
          className="seam-glow"
          x="50"
          y="131"
          width="240"
          height="3"
          fill="url(#bx-seam)"
          filter="url(#bx-seam-blur)"
        />
        <rect
          className="seam-glow"
          x="50"
          y="132"
          width="240"
          height="1.4"
          fill="url(#bx-seam)"
        />

        {/* ---- The flood, on opening only ------------------------------- */}
        <g className="box-flood" opacity="0">
          <rect x="50" y="96" width="240" height="42" fill="#ffffff" filter="url(#bx-soft)" />
          <ellipse cx="170" cy="130" rx="180" ry="90" fill="url(#bx-halo)" />
          <ellipse cx="170" cy="130" rx="210" ry="130" fill="url(#bx-halo)" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
