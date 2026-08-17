import React from "react";
import { AbsoluteFill } from "remotion";

import { SceneHeading } from "./SceneHeading";

/** Width shared by the code block and the summary cards, so the composition
 * stays anchored as the video cuts between them. */
export const CONTENT_WIDTH = 1120;

/**
 * Centers the heading + content group in the frame, with both sharing a left
 * edge. Every scene uses this so nothing shifts between cuts.
 */
export const SceneFrame: React.FC<{
  readonly heading: string;
  readonly accent?: string;
  readonly children: React.ReactNode;
}> = ({ heading, accent, children }) => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: CONTENT_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <SceneHeading accent={accent}>{heading}</SceneHeading>
        {children}
      </div>
    </AbsoluteFill>
  );
};
