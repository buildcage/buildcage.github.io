import type { HighlightedCode } from "codehike/code";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { CodeTransition } from "../components/CodeTransition";
import { CONTENT_WIDTH, SceneFrame } from "../components/SceneFrame";
import { color } from "../theme";

/**
 * Sized so the tallest workflow state still clears the frame — the font must
 * stay constant across scenes or the morphing tokens would scale.
 */
const FONT_SIZE = 25;
const LINE_HEIGHT = FONT_SIZE * 1.5;
const BLOCK_HEIGHT = 880;
/**
 * Gap between the Buildcage panel and the rest-of-workflow panel below it.
 * Matches one blank source line (`\n\n` between steps in workflow-steps.ts)
 * so the space between "Start Buildcage" and the next step reads the same as
 * the space between any two steps within the rest-of-workflow panel itself.
 */
const PANEL_GAP = LINE_HEIGHT;

/** Frames spent growing the Buildcage panel's reserved space before its text reveals. */
const GROW_FRAMES = 16;
/** Frames spent fading the Buildcage panel's content in, once there's room for it. */
const REVEAL_FRAMES = 20;

const lineCount = (c: HighlightedCode | null) => (c ? c.code.split("\n").length : 0);

export const CodeScene: React.FC<{
  readonly heading: string;
  readonly note?: string;
  readonly buildcageOld: HighlightedCode | null;
  readonly buildcageNew: HighlightedCode | null;
  readonly restOld: HighlightedCode | null;
  readonly restNew: HighlightedCode;
  readonly transitionFrames?: number;
}> = ({ heading, note, buildcageOld, buildcageNew, restOld, restNew, transitionFrames = 24 }) => {
  const frame = useCurrentFrame();

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
  const panelHeight = currentLines * LINE_HEIGHT;
  const panelMargin = buildcageNew
    ? PANEL_GAP * interpolate(growProgress, [0, 1], [oldLines > 0 ? 1 : 0, 1])
    : 0;

  return (
    <SceneFrame heading={heading} note={note}>
      <div
        style={{
          width: CONTENT_WIDTH,
          height: BLOCK_HEIGHT,
          background: color.codeBg,
          border: `1px solid ${color.rule}`,
          borderRadius: 14,
          padding: "30px 38px",
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
              fontSize={FONT_SIZE}
            />
          </div>
        )}
        <CodeTransition
          oldCode={restOld}
          newCode={restNew}
          durationInFrames={transitionFrames}
          fontSize={FONT_SIZE}
        />
      </div>
    </SceneFrame>
  );
};
