import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { Tagline, Wordmark } from "../components/Lockup";

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  const textIn = spring({
    frame: frame - 48,
    fps,
    config: { damping: 200 },
    durationInFrames: 24,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 56 }}>
      <Wordmark
        width={420}
        style={{
          opacity: logoIn,
          transform: `scale(${interpolate(logoIn, [0, 1], [0.94, 1])})`,
        }}
      />
      <Tagline
        fontSize={46}
        fontWeight={400}
        style={{
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [14, 0])}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
