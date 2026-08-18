import React from "react";
import { AbsoluteFill } from "remotion";

import { useLayout } from "../layout";
import { SceneHeading } from "./SceneHeading";

/**
 * Arranges a scene for whichever frame it's being rendered into.
 *
 * Wide: the code block is tall enough to fill the frame, so it sits beside the
 * heading — stacked, the heading ate the height the code needed, which is what
 * forced the type small on a 16:9 canvas. Shorter content (the Job Summary
 * cards, the run's step list) centres under the heading instead, since parking
 * it in the right-hand column left the left half of the frame empty.
 *
 * Narrow: there's height to spare, so everything stacks under the heading.
 *
 * Either way the heading's top edge lands in the same place from scene to
 * scene — beside the content it hangs off a box of fixed height, and stacked
 * the box is that same height plus the heading's own, which the heading holds
 * constant whether or not it carries a note.
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
          // Wide frames have no height to spare, so the box is the budget and
          // the content divides what the heading leaves — its content is a
          // screenshot or a step list, well short of the full height anyway.
          // Narrow frames let the box grow by the heading instead, which is
          // what keeps a full-height code block from running back under it.
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
