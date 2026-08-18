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
  readonly height: number;
  readonly transitionFrames?: number;
}> = ({
  heading,
  note,
  titleEnters,
  buildcageOld,
  buildcageNew,
  restOld,
  restNew,
  height,
  transitionFrames = 24,
}) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const lineHeight = layout.fontSize * 1.5;

  // Two independent CodeTransition instances, each diffed only against its
  // own previous state. The Buildcage step and the rest of the workflow never
  // share a token stream, so Code Hike can never correlate one block's tokens
  // with the other's — which is what caused an unrelated, unchanged step to
  // be misread as newly added when everything lived in one combined diff.
  //
  // Because the two blocks no longer share a diff, Code Hike also has no way
  // to know the rest-of-workflow block should slide down as the Buildcage
  // block grows — that motion is driven by hand here, animating the
  // Buildcage panel's reserved height from its old line count to its new one.
  // The height grows first, with the panel's own content held invisible via
  // `revealDelay`, then the content fades in once there's room for it — a
  // "make space, then reveal" beat that reads more clearly as a diff than
  // growing and fading in at the same time.
  const growProgress = interpolate(frame, [0, GROW_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldLines = lineCount(buildcageOld);
  const newLines = lineCount(buildcageNew);
  const currentLines = interpolate(growProgress, [0, 1], [oldLines, newLines]);
  const panelHeight = currentLines * lineHeight;
  const panelMargin = buildcageNew
    ? lineHeight * interpolate(growProgress, [0, 1], [oldLines > 0 ? 1 : 0, 1])
    : 0;

  return (
    <SceneFrame heading={heading} note={note} titleEnters={titleEnters} contentHeight={height}>
      <div
        style={{
          width: layout.contentWidth,
          height,
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
              revealDelay={GROW_FRAMES}
              fontSize={layout.fontSize}
            />
          </div>
        )}
        <CodeTransition
          oldCode={restOld}
          newCode={restNew}
          durationInFrames={transitionFrames}
          fontSize={layout.fontSize}
        />
      </div>
    </SceneFrame>
  );
};
