import { highlight, type HighlightedCode } from "codehike/code";
import type { CalculateMetadataFunction } from "remotion";

import { workflowStates } from "./content/workflow-steps";
import { addedLines, recolorLines } from "./diff-lines";
import { waitForFonts } from "./fonts";
import { addedLineColors, codeTheme } from "./theme";
import type { DemoProps } from "./Main";

const themeArg = codeTheme as unknown as Parameters<typeof highlight>[1];

const highlightYaml = (id: string, value: string) =>
  highlight({ lang: "yaml", meta: id, value }, themeArg);

/**
 * Highlights every YAML state (both tracks) ahead of render, then recolours
 * the lines each state introduces so they read as warm against the cool
 * palette of the code that was already there.
 *
 * The first state is exempt: it's the workflow the viewer already has, so
 * nothing in it counts as new.
 */
export const calculateMetadata: CalculateMetadataFunction<DemoProps> = async ({ props }) => {
  await waitForFonts();

  const buildcageSteps: (HighlightedCode | null)[] = [];
  const restSteps: HighlightedCode[] = [];

  for (const [i, state] of workflowStates.entries()) {
    const prev = i === 0 ? undefined : workflowStates[i - 1];

    if (state.buildcageYaml) {
      const code = await highlightYaml(state.id, state.buildcageYaml);
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
      buildcageSteps.push(null);
    }

    const rest = await highlightYaml(state.id, state.restYaml);
    restSteps.push(
      i === 0
        ? rest
        : recolorLines(rest, addedLines(prev?.restYaml ?? null, state.restYaml), addedLineColors),
    );
  }

  return { props: { ...props, buildcageSteps, restSteps } };
};
