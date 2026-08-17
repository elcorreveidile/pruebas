import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";

// Imagen de vista previa al compartir en redes (Open Graph). 1200×630.
export const alt = `${site.name} — Clínica dental en ${site.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function logoDataUri(): string {
  const buf = readFileSync(join(process.cwd(), "public", "media", "logo.png"));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffaef",
          position: "relative",
        }}
      >
        {/* Franja superior coral */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 16,
            backgroundColor: "#ff7f67",
            display: "flex",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri()} alt="" width={560} height={334} />

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 46,
            fontWeight: 700,
            color: "#1c160d",
          }}
        >
          {site.claim}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 30,
            color: "#d06540",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Clínica dental · {site.city}
        </div>
      </div>
    ),
    { ...size },
  );
}
