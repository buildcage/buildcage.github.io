import { useVideoConfig } from "remotion";

import { BLANK_LINE_SCALE } from "./components/CodeTransition";

/**
 * Scenes read the composition's aspect ratio and lay themselves out for it, so
 * one set of scenes renders as two cuts. Wide frames are short on height: the
 * heading takes a column beside the code. Narrow ones stack it above.
 */
export const WIDE_ASPECT = 1.6;

export type Layout = {
  readonly wide: boolean;
  readonly contentWidth: number;
  readonly fontSize: number;
  readonly framePadding: number;
  readonly columnGap: number;
  /** Enlarges the Job Summary card, whose type is sized in absolute pixels and
   * reads small in a wide frame. Scaling keeps its GitHub proportions. */
  readonly cardScale: number;
  /** Room between the heading and content stacked under it. A wide frame
   * centres its content in what the heading leaves, so it needs none. */
  readonly headingGap: number;
};

export const layoutFor = (width: number, height: number): Layout => {
  const wide = width / height >= WIDE_ASPECT;
  return wide
    ? {
        wide,
        contentWidth: 1140,
        fontSize: 30,
        framePadding: 40,
        columnGap: 48,
        cardScale: 1.25,
        headingGap: 0,
      }
    : {
        wide,
        contentWidth: 1120,
        fontSize: 25,
        framePadding: 40,
        columnGap: 0,
        cardScale: 1,
        headingGap: 28,
      };
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return layoutFor(width, height);
};

export const BLOCK_PADDING = 30;

/**
 * One height for every scene in a cut — the tallest state it reaches — so the
 * code block never resizes between beats.
 */
export const blockHeightFor = (
  states: readonly { buildcageYaml: string | null; restYaml: string }[],
  layout: Layout,
) => {
  // Blank lines are set shorter, so they count for less.
  const unitsOf = (yaml: string) =>
    yaml.split("\n").reduce((sum, line) => sum + (line.trim() === "" ? BLANK_LINE_SCALE : 1), 0);
  const tallest = Math.max(
    ...states.map(
      (state) =>
        (state.buildcageYaml ? unitsOf(state.buildcageYaml) + BLANK_LINE_SCALE : 0) +
        unitsOf(state.restYaml),
    ),
  );
  return tallest * layout.fontSize * 1.5 + BLOCK_PADDING * 2;
};
