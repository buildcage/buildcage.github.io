import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 420,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        }}
      />
    </AbsoluteFill>
  );
};
