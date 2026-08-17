import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { color, font } from "../theme";

/**
 * The step title holds still across the beats that belong to the same step —
 * only `note` changes — so a multi-part step reads as one step rather than
 * three.
 */
export const SceneHeading: React.FC<{
  readonly children: React.ReactNode;
  readonly note?: string;
  readonly accent?: string;
}> = ({ children, note, accent = color.mint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const y = interpolate(enter, [0, 1], [14, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        opacity: enter,
        transform: `translateY(${y}px)`,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          width: 6,
          height: note ? 62 : 34,
          borderRadius: 3,
          background: accent,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: font.heading,
            fontWeight: 500,
            fontSize: 40,
            color: color.fg,
            letterSpacing: -0.5,
          }}
        >
          {children}
        </div>
        {note && (
          <div
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: 27,
              color: color.muted,
              marginTop: 6,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};
