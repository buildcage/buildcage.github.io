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
 * The blank lines between steps are real YAML lines and render full height,
 * eating the frame. Shrinking them buys room to set the code larger.
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
   * Holds the whole snippet at its starting point — nothing drawn — so a
   * container can grow into its new size before its content appears. Only for
   * a block appearing from nothing; it blanks one that has existing lines.
   */
  readonly revealDelay?: number;
  /** Holds back only the tokens that fade in, leaving what's already on screen
   * to transition on schedule. */
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

    // Rising opacity means arriving; falling means leaving, which must never be
    // held back or it lingers over the line replacing it.
    const isEntering = ({ keyframes }: (typeof transitions)[number]) =>
      Boolean(keyframes.opacity && keyframes.opacity[1] > keyframes.opacity[0]);
    // Shift the arrivals as a group so they start when asked but keep the
    // stagger between their lines.
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
