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

import { color, font } from "../theme";

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
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 420,
          opacity: logoIn,
          transform: `scale(${interpolate(logoIn, [0, 1], [0.94, 1])})`,
        }}
      />
      <div
        style={{
          fontFamily: font.heading,
          fontWeight: 400,
          fontSize: 46,
          color: color.fg,
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [14, 0])}px)`,
          textAlign: "center",
        }}
      >
        Network isolation for your build,
        <br />
        <span style={{ color: color.mint }}>in three steps</span>
      </div>
    </AbsoluteFill>
  );
};
