import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are self-hosted from public/fonts (variable woff2, OFL-licensed) so renders
// are deterministic and work without reaching Google Fonts from headless Chrome.
// loadFont() blocks rendering until the font is ready.
loadFont({
  family: "Space Grotesk",
  url: staticFile("fonts/SpaceGrotesk-Variable.woff2"),
  weight: "300 700",
});
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-Variable.woff2"),
  weight: "100 900",
});

export const fonts = {
  display: "'Space Grotesk', sans-serif",
  body: "Inter, sans-serif",
};

// One deliberate palette, reused everywhere: deep ink, warm paper, one accent.
export const colors = {
  ink: "#0B0F1A",
  inkSoft: "#151B2B",
  paper: "#F4F1EA",
  muted: "#8A93A6",
  accent: "#FF6B4A",
  accentSoft: "#FFB199",
  grid: "rgba(244, 241, 234, 0.08)",
};

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
