import { type AnnotationHandler, type HighlightedCode, InnerToken, Pre } from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Easing, interpolate, useCurrentFrame, useDelayRender } from "remotion";

import { font } from "../theme";
import { applyStyle } from "./token-style";

const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  Token: ({ ...props }) => <InnerToken merge={props} style={{ display: "inline-block" }} />,
};

/** How much of a line height the blank line between two steps takes up. */
export const BLANK_LINE_SCALE = 0.4;

/**
 * The blank lines separating workflow steps are real lines in the YAML, so
 * they render at a full line height and eat a surprising amount of the frame.
 * Shrinking just those keeps the steps visually grouped while giving the code
 * back the room to be set larger.
 */
const compactBlankLines = (code: string, lineHeight: number): AnnotationHandler => {
  const blank = new Set(
    code
      .split("\n")
      .map((line, i) => (line.trim() === "" ? i + 1 : null))
      .filter((n): n is number => n !== null),
  );

  return {
    name: "compact-blank-lines",
    Line: ({ lineNumber, style, ...props }) => (
      <div
        {...props}
        style={
          blank.has(lineNumber)
            ? { ...style, height: lineHeight * BLANK_LINE_SCALE, lineHeight: "0" }
            : style
        }
      />
    ),
  };
};

/**
 * Morphs one highlighted snippet into the next, driven off the current frame so
 * it renders deterministically. Adapted from Remotion's official Code Hike
 * template (packages/template-code-hike/src/CodeTransition.tsx), with the
 * TypeScript-only callout/error annotations removed — our snippets are YAML.
 */
export const CodeTransition: React.FC<{
  readonly oldCode: HighlightedCode | null;
  readonly newCode: HighlightedCode;
  readonly durationInFrames?: number;
  readonly fontSize?: number;
  /**
   * Frames to hold the transition at its starting point before it plays.
   * Lets a container grow into its new size first, with content still
   * hidden, then reveal the content once there's room for it — a
   * "make space, then fade in" beat instead of both happening at once.
   */
  readonly revealDelay?: number;
  /**
   * Frames to hold back only the tokens that fade in, leaving everything
   * already on screen to transition on schedule. `revealDelay` holds the whole
   * snippet at its starting point, where nothing is drawn yet — fine for a
   * block appearing from nothing, but it blanks a block that has existing
   * lines in it. This delays the arrival without hiding what's already there.
   */
  readonly enterDelay?: number;
}> = ({
  oldCode,
  newCode,
  durationInFrames = 24,
  fontSize = 30,
  revealDelay = 0,
  enterDelay = 0,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = Math.max(0, rawFrame - revealDelay);
  const ref = React.useRef<HTMLPreElement>(null);
  const [oldSnapshot, setOldSnapshot] = useState<TokenTransitionsSnapshot | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const prevCode: HighlightedCode = useMemo(() => {
    return oldCode ?? { ...newCode, tokens: [], annotations: [] };
  }, [newCode, oldCode]);

  const code = useMemo(() => {
    return oldSnapshot ? newCode : prevCode;
  }, [newCode, prevCode, oldSnapshot]);

  useEffect(() => {
    if (!oldSnapshot && ref.current) {
      setOldSnapshot(getStartingSnapshot(ref.current));
    }
  }, [oldSnapshot]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current));
      return;
    }

    const transitions = calculateTransitions(ref.current, oldSnapshot);

    // Rising opacity marks a token that wasn't there before; a falling one is
    // on its way out and must not be held back, or it would linger over the
    // lines taking its place.
    const isEntering = ({ keyframes }: (typeof transitions)[number]) =>
      Boolean(keyframes.opacity && keyframes.opacity[1] > keyframes.opacity[0]);
    // Where the arrivals would have begun on their own. Shifting the whole
    // group by the difference starts it when asked while keeping the stagger
    // between its lines — flattening that would make the block land all at
    // once beside one that arrives line by line.
    const enteringDelays = transitions.filter(isEntering).map(({ options }) => options.delay);
    const firstEnter = enteringDelays.length > 0 ? Math.min(...enteringDelays) : 0;

    for (const transition of transitions) {
      const { element, keyframes, options } = transition;
      const held = enterDelay > 0 && isEntering(transition);
      const delay = held
        ? enterDelay + durationInFrames * (options.delay - firstEnter)
        : durationInFrames * options.delay;
      const duration = durationInFrames * options.duration;
      const linearProgress = interpolate(frame, [delay, delay + duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const progress = interpolate(linearProgress, [0, 1], [0, 1], {
        easing: Easing.bezier(0.17, 0.67, 0.76, 0.91),
      });

      applyStyle({ element, keyframes, progress, linearProgress });
    }

    continueRender(handle);
  });

  const handlers = useMemo<AnnotationHandler[]>(
    () => [tokenTransitions, compactBlankLines(code.code, fontSize * 1.5)],
    [code.code, fontSize],
  );

  const style = useMemo<React.CSSProperties>(
    () => ({
      position: "relative",
      margin: 0,
      fontSize,
      lineHeight: 1.5,
      fontFamily: font.mono,
      tabSize: 2,
    }),
    [fontSize],
  );

  return <Pre ref={ref} code={code} handlers={handlers} style={style} />;
};
