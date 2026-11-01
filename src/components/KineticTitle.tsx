import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, easeOutExpo, fonts } from "../theme";

type Props = {
  words: string[];
  /** Index of the word to highlight in the accent colour. */
  accentIndex?: number;
  fontSize?: number;
  /** Frames between each word's entrance. */
  stagger?: number;
};

/** Word-by-word spring entrance with a masked rise — reusable for any headline. */
export const KineticTitle: React.FC<Props> = ({
  words,
  accentIndex,
  fontSize = 140,
  stagger = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: fontSize * 0.28,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.05,
        letterSpacing: "-0.035em",
        color: colors.paper,
      }}
    >
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - i * stagger,
          fps,
          config: { damping: 200 },
          durationInFrames: Math.round(0.9 * fps),
        });
        return (
          <span
            key={word + i}
            style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em" }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0 ${interpolate(progress, [0, 1], [110, 0])}%`,
                opacity: interpolate(frame - i * stagger, [0, 0.4 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...easeOutExpo),
                }),
                color: i === accentIndex ? colors.accent : colors.paper,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
