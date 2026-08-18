import React from "react";
import { AbsoluteFill } from "remotion";

import { useLayout } from "../layout";
import { SceneHeading } from "./SceneHeading";

/**
 * Arranges a scene for the frame it's rendered into. Wide puts the heading
 * beside the code, which needs the full height; shorter content (`centered`)
 * sits under it instead, so the left half isn't left empty. Narrow stacks
 * everything.
 *
 * Either way the heading's top lands in the same place from scene to scene.
 */
export const SceneFrame: React.FC<{
  readonly heading: string;
  readonly note?: string;
  readonly accent?: string;
  readonly titleEnters?: boolean;
  /** Height of the tallest thing the cut shows — the code block. */
  readonly contentHeight: number;
  /** Centre the content under the heading instead of setting it beside. */
  readonly centered?: boolean;
  readonly children: React.ReactNode;
}> = ({ heading, note, accent, titleEnters, contentHeight, centered = false, children }) => {
  const layout = useLayout();

  const headingNode = (
    <SceneHeading note={note} accent={accent} titleEnters={titleEnters}>
      {heading}
    </SceneHeading>
  );

  const stacked = !layout.wide || centered;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${layout.framePadding}px`,
      }}
    >
      <div
        style={{
          width: layout.wide ? "100%" : layout.contentWidth,
          // Wide: the box is the height budget and the content takes what the
          // heading leaves. Narrow: the box grows by the heading instead, so a
          // full-height code block can't run back under it.
          height: layout.wide ? contentHeight : undefined,
          display: "flex",
          gap: layout.columnGap,
        }}
      >
        {stacked ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {headingNode}
            <div
              style={{
                ...(layout.wide
                  ? { flex: 1 }
                  : { height: contentHeight, marginTop: layout.headingGap }),
                display: "flex",
                alignItems: "center",
                justifyContent: layout.wide ? "center" : "flex-start",
                minHeight: 0,
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start", minWidth: 0 }}>
              {headingNode}
            </div>
            <div
              style={{
                width: layout.contentWidth,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
