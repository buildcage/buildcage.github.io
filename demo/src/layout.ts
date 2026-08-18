import { useVideoConfig } from "remotion";

import { BLANK_LINE_SCALE } from "./components/CodeTransition";

/**
 * One source, two shapes. The scenes read the composition's own aspect ratio
 * and lay themselves out for it, the way a page reads its viewport — so
 * rendering the same composition at 16:9 and at 4:3 produces two cuts, each
 * composed for its frame, with no duplicated scene code.
 *
 * Wide frames are short: fitting the workflow means small type unless the
 * heading moves out of the way, so it takes a column of its own beside the
 * code. Narrow frames have the height to stack them, and the code can be set
 * larger relative to the frame.
 */
export const WIDE_ASPECT = 1.6;

export type Layout = {
  readonly wide: boolean;
  readonly contentWidth: number;
  readonly fontSize: number;
  readonly framePadding: number;
  readonly columnGap: number;
  /**
   * How much to enlarge the Job Summary card over its authored size. The card
   * is built at the width the code block uses, which reads well in a narrow
   * frame but leaves a 16:9 one mostly empty — and its type, sized in absolute
   * pixels, small against the rest. Scaling takes the whole card up together,
   * so the GitHub proportions it copies survive.
   */
  readonly cardScale: number;
  /**
   * Space between the heading and the content stacked under it. Zero in a wide
   * frame, where the content is centred in what the heading leaves and so
   * carries its own slack; a stacked code block fills its box exactly and would
   * otherwise butt straight up against the note.
   */
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
 * One height for every scene in a cut: the tallest state it reaches. Holding
 * it constant keeps the block from resizing between beats, and deriving it
 * per cut means a short workflow doesn't sit in a frame sized for a long one.
 */
export const blockHeightFor = (
  states: readonly { buildcageYaml: string | null; restYaml: string }[],
  layout: Layout,
) => {
  // Blank lines are set shorter than the rest, so they count for less here too.
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
