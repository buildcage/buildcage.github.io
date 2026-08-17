import React from "react";
import { interpolate } from "remotion";

import { font, gh } from "../theme";

/**
 * The `▶ Switch to restrict mode` disclosure from the audit report, driven open
 * by `progress` (0 = collapsed, 1 = fully open) rather than by a click.
 */
export const Disclosure: React.FC<{
  readonly label: string;
  readonly icon: string;
  readonly progress: number;
  readonly children: React.ReactNode;
  /** Rendered height of the revealed body, used to animate the reveal. */
  readonly bodyHeight: number;
}> = ({ label, icon, progress, children, bodyHeight }) => {
  const rotation = interpolate(progress, [0, 0.35], [0, 90], {
    extrapolateRight: "clamp",
  });
  const height = interpolate(progress, [0.2, 1], [0, bodyHeight], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyOpacity = interpolate(progress, [0.45, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: font.body,
          fontSize: 26,
          color: gh.fg,
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
            fontSize: 18,
          }}
        >
          ▶
        </span>
        <span>{icon}</span>
        <span>{label}</span>
      </div>

      <div style={{ height, overflow: "hidden" }}>
        <div style={{ opacity: bodyOpacity, paddingTop: 14 }}>{children}</div>
      </div>
    </div>
  );
};
