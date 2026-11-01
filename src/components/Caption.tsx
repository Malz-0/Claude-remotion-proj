import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, easeOutExpo, fonts } from "../theme";

export type Cue = { text: string; startSec: number; endSec: number };

/** Lower-third subtitle track. Cues fade/rise in and out; safe-area aware. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.startSec && t < c.endSec);
  if (!cue) return null;

  const local = frame - cue.startSec * fps;
  const remaining = cue.endSec * fps - frame;
  const opacity = Math.min(
    interpolate(local, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(remaining, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: height * 0.08,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 38,
          color: colors.paper,
          background: "rgba(11,15,26,0.72)",
          padding: "14px 28px",
          borderRadius: 14,
          opacity,
          translate: `0 ${interpolate(local, [0, 12], [16, 0], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOutExpo),
          })}px`,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
