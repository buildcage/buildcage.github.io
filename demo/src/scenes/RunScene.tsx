import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { SceneFrame } from "../components/SceneFrame";
import { useLayout } from "../layout";
import { color, font } from "../theme";

type StepState = "pending" | "active" | "done";

/**
 * Drawn rather than typed: the glyphs come from whatever fallback font the
 * renderer has, and a row grew or shrank as one mark replaced another.
 */
const StepMark: React.FC<{ readonly state: StepState; readonly stroke: string }> = ({
  state,
  stroke,
}) => (
  <svg width={32} height={32} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    {state === "done" ? (
      <path
        d="M7 16.5 L13.5 23 L25 9.5"
        fill="none"
        stroke={stroke}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : state === "active" ? (
      <circle cx={16} cy={16} r={8} fill={stroke} />
    ) : (
      <circle cx={16} cy={16} r={7} fill="none" stroke={stroke} strokeWidth={2.5} />
    )}
  </svg>
);

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
    <SceneFrame
      heading={heading}
      note={note}
      accent={color.cyan}
      contentHeight={contentHeight}
      centered
    >
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

          const state: StepState = done ? "done" : active ? "active" : "pending";
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
              <StepMark state={state} stroke={markColor} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
