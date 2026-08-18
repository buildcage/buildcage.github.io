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
  /**
   * False when the previous scene showed this same title. Each scene is its
   * own sequence, so the heading would otherwise replay its entrance on every
   * beat of a multi-part step — the text flashing back in unchanged, which
   * reads as a glitch. Only the note animates in that case.
   */
  readonly titleEnters?: boolean;
}> = ({ children, note, accent = color.mint, titleEnters = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springIn = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 18 });

  const titleEnter = titleEnters ? springIn(0) : 1;
  // A held title has already introduced the block, so the note follows it in
  // rather than arriving alongside.
  const noteEnter = titleEnters ? springIn(0) : springIn(6);

  return (
    <div
      style={{
        display: "flex",
        // Stretch rather than a fixed height: the bar then always spans the
        // text beside it, with or without a note.
        alignItems: "stretch",
        gap: 20,

      }}
    >
      <div
        style={{
          width: 7,
          borderRadius: 3,
          background: accent,
          flexShrink: 0,
          opacity: titleEnter,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: font.heading,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.25,
            color: color.fg,
            letterSpacing: -0.5,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [14, 0])}px)`,
          }}
        >
          {children}
        </div>
        {note && (
          <div
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: 28,
              lineHeight: 1.3,
              color: color.muted,
              marginTop: 6,
              opacity: noteEnter,
              transform: `translateY(${interpolate(noteEnter, [0, 1], [10, 0])}px)`,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};
