import React from "react";
import { Audio } from "@remotion/media";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BarChart, Datum } from "../components/BarChart";
import { Captions, Cue } from "../components/Caption";
import { KineticTitle } from "../components/KineticTitle";
import { colors, easeOutExpo, fonts } from "../theme";

export const SCENES = { intro: 105, chart: 150, outro: 115 } as const;
export const TRANSITION = 20;
export const SHOWCASE_DURATION =
  SCENES.intro + SCENES.chart + SCENES.outro - 2 * TRANSITION;

const DATA: Datum[] = [
  { label: "2021", value: 18 },
  { label: "2022", value: 31 },
  { label: "2023", value: 47 },
  { label: "2024", value: 64 },
  { label: "2025", value: 92 },
];

const CUES: Cue[] = [
  { text: "Every frame here is React, rendered by Remotion.", startSec: 0.8, endSec: 3.2 },
  { text: "Data drives the motion — swap the numbers, re-render.", startSec: 4.0, endSec: 8.0 },
  { text: "Typography, transitions and audio in one timeline.", startSec: 8.4, endSec: 10.6 },
];

const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: "0.32em",
        // Cancel trailing tracking so centred labels sit optically centred.
        marginRight: "-0.32em",
        textTransform: "uppercase",
        color: colors.accent,
        opacity: interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: `${interpolate(frame - delay, [0, 20], [-24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOutExpo),
        })}px 0`,
      }}
    >
      {children}
    </div>
  );
};

const AccentRule: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        height: 6,
        width: 220,
        borderRadius: 3,
        background: colors.accent,
        transformOrigin: "center",
        scale: `${interpolate(frame - delay, [0, 0.7 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOutExpo),
        })} 1`,
      }}
    />
  );
};

const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Eyebrow>Pipeline check · 001</Eyebrow>
      <KineticTitle words={["Video,", "written", "in", "code."]} accentIndex={3} />
      <AccentRule delay={22} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const ChartScene: React.FC = () => (
  <AbsoluteFill>
    <Backdrop hue="#4A7BFF" />
    <AbsoluteFill style={{ padding: "120px 160px", flexDirection: "row", gap: 120 }}>
      <div style={{ width: 520, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        <Eyebrow delay={6}>Growth</Eyebrow>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: colors.paper,
          }}
        >
          Charts that animate themselves.
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 30, lineHeight: 1.45, color: colors.muted }}>
          Bars are driven by data, not keyframes — values count up with the spring.
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <BarChart data={DATA} width={940} height={620} highlight={4} unit="k" />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const OutroScene: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36 }}>
      <KineticTitle words={["Ready", "to", "render."]} accentIndex={2} fontSize={150} stagger={6} />
      <Eyebrow delay={20}>1920 × 1080 · 30 fps · H.264</Eyebrow>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Showcase: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={SCENES.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence name="Chart" durationInFrames={SCENES.chart}>
          <ChartScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence name="Outro" durationInFrames={SCENES.outro}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Captions cues={CUES} />
      <Audio
        src={staticFile("audio/pad.mp3")}
        volume={(f) =>
          interpolate(f, [0, fps, durationInFrames - fps, durationInFrames], [0, 0.8, 0.8, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
