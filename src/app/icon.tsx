import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The box end-on, with light along the seam. The whole project in 64px. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050506",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 34,
            height: 34,
            border: "2px solid #3a3d44",
            background: "#000000",
          }}
        >
          <div style={{ display: "flex", height: 9 }} />
          <div style={{ display: "flex", height: 3, background: "#ffffff" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
