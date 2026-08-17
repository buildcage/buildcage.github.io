import { highlight, type HighlightedCode } from "codehike/code";
import type { CalculateMetadataFunction } from "remotion";

import { workflowStates } from "./content/workflow-steps";
import { waitForFonts } from "./fonts";
import { codeTheme } from "./theme";
import type { DemoProps } from "./Main";

const themeArg = codeTheme as unknown as Parameters<typeof highlight>[1];

/**
 * Highlights every YAML state (both tracks) ahead of render. `highlight()`
 * accepts a plain Shiki-shaped theme object (verified), so the landing page's
 * own token colors carry into the video.
 */
export const calculateMetadata: CalculateMetadataFunction<DemoProps> = async ({ props }) => {
  await waitForFonts();

  const buildcageSteps: (HighlightedCode | null)[] = [];
  const restSteps: HighlightedCode[] = [];

  for (const state of workflowStates) {
    buildcageSteps.push(
      state.buildcageYaml
        ? await highlight({ lang: "yaml", meta: state.id, value: state.buildcageYaml }, themeArg)
        : null,
    );
    restSteps.push(
      await highlight({ lang: "yaml", meta: state.id, value: state.restYaml }, themeArg),
    );
  }

  return { props: { ...props, buildcageSteps, restSteps } };
};
