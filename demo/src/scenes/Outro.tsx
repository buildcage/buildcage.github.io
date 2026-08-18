import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { Wordmark } from "../components/Lockup";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Wordmark
        width={420}
        style={{
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        }}
      />
    </AbsoluteFill>
  );
};
