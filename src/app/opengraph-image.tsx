import { ImageResponse } from "next/og";

export const alt = "Prime — Alcanzá tu prime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Isotipo (el "pico") como data-URI para <img>.
const peak = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="24,78 76,78 50,18" fill="#F2EDE4"/><circle cx="50" cy="9" r="5" fill="#D85A30"/></svg>',
)}`;

const AREA_COLORS = ["#D85A30", "#7F77DD", "#1D9E75", "#BA7517"];

export default async function OpengraphImage() {
  const FONT = "https://cdn.jsdelivr.net/npm/@fontsource";
  const [fraunces, inter, interMedium] = await Promise.all([
    fetch(`${FONT}/fraunces/files/fraunces-latin-500-normal.woff`).then((r) =>
      r.arrayBuffer(),
    ),
    fetch(`${FONT}/inter/files/inter-latin-400-normal.woff`).then((r) =>
      r.arrayBuffer(),
    ),
    fetch(`${FONT}/inter/files/inter-latin-500-normal.woff`).then((r) =>
      r.arrayBuffer(),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14120F",
          padding: "72px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* blobs de color */}
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: 480,
            display: "flex",
            background:
              "radial-gradient(closest-side, rgba(216,90,48,0.55), rgba(216,90,48,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 440,
            height: 440,
            borderRadius: 440,
            display: "flex",
            background:
              "radial-gradient(closest-side, rgba(127,119,221,0.5), rgba(127,119,221,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: 420,
            width: 440,
            height: 440,
            borderRadius: 440,
            display: "flex",
            background:
              "radial-gradient(closest-side, rgba(29,158,117,0.42), rgba(29,158,117,0))",
          }}
        />

        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={peak} width={46} height={46} alt="" />
          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: 40,
              color: "#F2EDE4",
              letterSpacing: -0.5,
            }}
          >
            prime
          </div>
        </div>

        {/* headline + subtítulo */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 96,
              color: "#F2EDE4",
              lineHeight: 1,
              letterSpacing: -1.5,
            }}
          >
            <span style={{ color: "#F2EDE4" }}>Alcanzá tu&nbsp;</span>
            <span style={{ color: "#D85A30" }}>prime</span>
            <span style={{ color: "#F2EDE4" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontFamily: "Inter",
              fontSize: 30,
              color: "#948E80",
              maxWidth: 860,
              lineHeight: 1.4,
            }}
          >
            Organizá tu rutina diaria y medí tu progreso real — físico, mental,
            personal y laboral.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {AREA_COLORS.map((c) => (
              <div
                key={c}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 16,
                  background: c,
                  display: "flex",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: 24,
              color: "#5C5848",
            }}
          >
            prime-steel-sigma.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 500, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
