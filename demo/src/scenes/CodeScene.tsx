import type { HighlightedCode } from "codehike/code";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { BLANK_LINE_SCALE, CodeTransition } from "../components/CodeTransition";
import { BLOCK_PADDING, useLayout } from "../layout";
import { SceneFrame } from "../components/SceneFrame";
import { color } from "../theme";

/** Frames spent growing the Buildcage panel's reserved space before its text reveals. */
const GROW_FRAMES = 16;
/** Frames spent fading the Buildcage panel's content in, once there's room for it. */
const REVEAL_FRAMES = 20;

const lineCount = (c: HighlightedCode | null) => (c ? c.code.split("\n").length : 0);

export const CodeScene: React.FC<{
  readonly heading: string;
  readonly note?: string;
  readonly titleEnters?: boolean;
  readonly buildcageOld: HighlightedCode | null;
  readonly buildcageNew: HighlightedCode | null;
  readonly restOld: HighlightedCode | null;
  readonly restNew: HighlightedCode;
  /** Height of the code block, held constant across a cut's scenes. */
  readonly contentHeight: number;
  readonly transitionFrames?: number;
}> = ({
  heading,
  note,
  titleEnters,
  buildcageOld,
  buildcageNew,
  restOld,
  restNew,
  contentHeight,
  transitionFrames = 24,
}) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const lineHeight = layout.fontSize * 1.5;

  // Two independent CodeTransition instances so Code Hike can never correlate
  // the Buildcage step's tokens with the rest of the workflow's — sharing one
  // diff made unchanged steps read as newly added.
  //
  // The cost is that neither block knows the other moved, so the panel's
  // growth is animated by hand here and the rest slides down with it.
  const growProgress = interpolate(frame, [0, GROW_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldLines = lineCount(buildcageOld);
  const newLines = lineCount(buildcageNew);
  const currentLines = interpolate(growProgress, [0, 1], [oldLines, newLines]);
  const panelHeight = currentLines * lineHeight;
  // The space under the panel stands for the blank line between any two steps,
  // so it matches the height those are compressed to.
  const gap = lineHeight * BLANK_LINE_SCALE;
  const panelMargin = buildcageNew
    ? gap * interpolate(growProgress, [0, 1], [oldLines > 0 ? 1 : 0, 1])
    : 0;

  // A growing panel is the only case where the workflow must move before
  // anything new can land. Holding both for that long lands the additions at
  // either end together — they are one edit.
  const panelGrows = newLines !== oldLines;

  return (
    <SceneFrame
      heading={heading}
      note={note}
      titleEnters={titleEnters}
      contentHeight={contentHeight}
    >
      <div
        style={{
          width: layout.contentWidth,
          height: contentHeight,
          background: color.codeBg,
          border: `1px solid ${color.rule}`,
          borderRadius: 14,
          padding: `${BLOCK_PADDING}px 38px`,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {buildcageNew && (
          <div style={{ height: panelHeight, marginBottom: panelMargin, overflow: "hidden" }}>
            <CodeTransition
              oldCode={buildcageOld}
              newCode={buildcageNew}
              durationInFrames={REVEAL_FRAMES}
              // A panel that only changes contents has nothing to wait for,
              // and holding it there blanks the step.
              revealDelay={panelGrows ? GROW_FRAMES : 0}
              fontSize={layout.fontSize}
            />
          </div>
        )}
        <CodeTransition
          oldCode={restOld}
          newCode={restNew}
          durationInFrames={panelGrows ? REVEAL_FRAMES : transitionFrames}
          enterDelay={panelGrows ? GROW_FRAMES : 0}
          fontSize={layout.fontSize}
        />
      </div>
    </SceneFrame>
  );
};
