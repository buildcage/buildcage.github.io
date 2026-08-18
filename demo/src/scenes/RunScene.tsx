import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { SceneFrame } from "../components/SceneFrame";
import { useLayout } from "../layout";
import { color, font } from "../theme";

/**
 * A stylized stand-in for the Actions run — deliberately not a screen recording,
 * so it never goes stale when GitHub's UI changes.
 */
export const RunScene: React.FC<{
  readonly heading: string;
  readonly note?: string;
  readonly steps: readonly string[];
  readonly contentHeight: number;
}> = ({ heading, note, steps, contentHeight }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { durationInFrames } = useVideoConfig();

  const start = 16;
  const perStep = (durationInFrames - start - 16) / steps.length;

  return (
    <SceneFrame heading={heading} note={note} accent={color.cyan} contentHeight={contentHeight} centered>
      <div
        style={{
          width: layout.contentWidth,
          background: color.codeBg,
          border: `1px solid ${color.rule}`,
          borderRadius: 14,
          padding: "34px 44px",
          boxSizing: "border-box",
        }}
      >
        {steps.map((label, i) => {
          const stepStart = start + i * perStep;
          const done = frame >= stepStart + perStep * 0.72;
          const active = frame >= stepStart && !done;
          const appear = interpolate(frame, [stepStart - 6, stepStart + 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const mark = done ? "✓" : active ? "●" : "○";
          const markColor = done ? color.mint : active ? color.cyan : color.rule;

          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "16px 0",
                opacity: 0.28 + 0.72 * appear,
                fontFamily: font.mono,
                fontSize: 32,
                color: done || active ? color.fg : color.muted,
              }}
            >
              <span style={{ color: markColor, width: 32 }}>{mark}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
