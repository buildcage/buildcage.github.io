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
  //
  // When the panel is growing, nothing new is shown until it has finished:
  // the space appears first, then everything the step adds arrives into it at
  // once. A "make space, then reveal" beat reads more clearly as a diff than
  // growing and fading in at the same time. When the panel isn't growing there
  // is nothing to wait for, so the beat is skipped (see `panelGrows` below).
  const growProgress = interpolate(frame, [0, GROW_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldLines = lineCount(buildcageOld);
  const newLines = lineCount(buildcageNew);
  const currentLines = interpolate(growProgress, [0, 1], [oldLines, newLines]);
  const panelHeight = currentLines * lineHeight;
  // The panel is a separate block, but the space under it stands for the same
  // blank line that separates any two steps — so it's set to the same height
  // those are compressed to, and the gaps down the workflow read as even.
  const gap = lineHeight * BLANK_LINE_SCALE;
  const panelMargin = buildcageNew
    ? gap * interpolate(growProgress, [0, 1], [oldLines > 0 ? 1 : 0, 1])
    : 0;

  // Only when the panel is making room does the rest of the workflow have to
  // move before anything new can land. Holding its transition for that long
  // then playing it over the panel's own reveal window puts the two additions
  // on screen together — they're one edit, and arriving apart looked like two.
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
              // Only worth holding when the panel is actually making room. A
              // panel that merely changes contents has nothing to wait for,
              // and holding it there blanked the step for half a second.
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
