import { highlight, type HighlightedCode } from "codehike/code";
import type { CalculateMetadataFunction } from "remotion";

import { products } from "./content/products";
import { addedLines, recolorLines } from "./diff-lines";
import { waitForFonts } from "./fonts";
import { addedLineColors, codeTheme } from "./theme";
import type { DemoProps } from "./Main";

const themeArg = codeTheme as unknown as Parameters<typeof highlight>[1];

const highlightYaml = (id: string, value: string) =>
  highlight({ lang: "yaml", meta: id, value }, themeArg);

/**
 * Highlights every YAML state ahead of render, then recolours the lines each
 * state introduces so they read warm against the code already there. The first
 * state is exempt — it's the workflow the viewer already has.
 *
 * Each state is kept twice, highlighted and plain. A scene morphs out of the
 * *plain* previous state, so the highlight marks what this step changed and
 * doesn't carry into the next scene to recolour itself mid-shot.
 */
export const calculateMetadata: CalculateMetadataFunction<DemoProps> = async ({ props }) => {
  await waitForFonts();

  const buildcageSteps: (HighlightedCode | null)[] = [];
  const buildcagePlain: (HighlightedCode | null)[] = [];
  const restSteps: HighlightedCode[] = [];
  const restPlain: HighlightedCode[] = [];

  for (const [i, state] of products[props.product].states.entries()) {
    const prev = i === 0 ? undefined : products[props.product].states[i - 1];

    if (state.buildcageYaml) {
      const code = await highlightYaml(state.id, state.buildcageYaml);
      buildcagePlain.push(code);
      buildcageSteps.push(
        i === 0
          ? code
          : recolorLines(
              code,
              addedLines(prev?.buildcageYaml ?? null, state.buildcageYaml),
              addedLineColors,
            ),
      );
    } else {
      buildcagePlain.push(null);
      buildcageSteps.push(null);
    }

    const rest = await highlightYaml(state.id, state.restYaml);
    restPlain.push(rest);
    restSteps.push(
      i === 0
        ? rest
        : recolorLines(rest, addedLines(prev?.restYaml ?? null, state.restYaml), addedLineColors),
    );
  }

  return { props: { ...props, buildcageSteps, buildcagePlain, restSteps, restPlain } };
};
