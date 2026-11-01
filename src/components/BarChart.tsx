import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, easeOutExpo, fonts } from "../theme";

export type Datum = { label: string; value: number };

type Props = {
  data: Datum[];
  width: number;
  height: number;
  /** Index of the bar drawn in the accent colour. */
  highlight?: number;
  unit?: string;
};

/** Animated bar chart: gridlines draw in, bars spring up in sequence, values count up. */
export const BarChart: React.FC<Props> = ({ data, width, height, highlight, unit = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...data.map((d) => d.value));
  const labelSpace = 64;
  const chartH = height - labelSpace;
  const gap = 36;
  const barW = (width - gap * (data.length - 1)) / data.length;
  const gridLines = 4;

  return (
    <div style={{ position: "relative", width, height, fontFamily: fonts.body }}>
      {Array.from({ length: gridLines + 1 }).map((_, g) => (
        <div
          key={g}
          style={{
            position: "absolute",
            left: 0,
            top: chartH - (chartH * g) / gridLines,
            height: 2,
            width,
            background: g === 0 ? "rgba(244,241,234,0.35)" : colors.grid,
            transformOrigin: "left",
            scale: `${interpolate(frame, [g * 3, g * 3 + 0.8 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOutExpo),
            })} 1`,
          }}
        />
      ))}
      {data.map((d, i) => {
        const delay = Math.round(0.4 * fps) + i * 6;
        const grow = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.9 } });
        const barH = (d.value / max) * (chartH - 40) * grow;
        const isHi = i === highlight;
        const shown = Math.round(d.value * Math.min(grow, 1));
        return (
          <div key={d.label}>
            <div
              style={{
                position: "absolute",
                left: i * (barW + gap),
                top: chartH - barH,
                width: barW,
                height: barH,
                borderRadius: "10px 10px 0 0",
                background: isHi
                  ? `linear-gradient(180deg, ${colors.accentSoft}, ${colors.accent})`
                  : "rgba(244,241,234,0.16)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: i * (barW + gap),
                width: barW,
                top: chartH - barH - 50,
                textAlign: "center",
                fontWeight: 600,
                fontSize: 32,
                fontVariantNumeric: "tabular-nums",
                color: isHi ? colors.accent : colors.paper,
                opacity: interpolate(grow, [0.2, 0.6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {shown}
              {unit}
            </div>
            <div
              style={{
                position: "absolute",
                left: i * (barW + gap),
                width: barW,
                top: chartH + 18,
                textAlign: "center",
                fontSize: 26,
                color: colors.muted,
                letterSpacing: "0.04em",
              }}
            >
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
