import type { HighlightedCode } from "codehike/code";
import React from "react";
import { AbsoluteFill, Series } from "remotion";

import { blockHeightFor, useLayout } from "./layout";

import { AuditSummaryScene } from "./scenes/AuditSummaryScene";
import { CodeScene } from "./scenes/CodeScene";
import { Outro } from "./scenes/Outro";
import { RestrictSummaryScene } from "./scenes/RestrictSummaryScene";
import { RunScene } from "./scenes/RunScene";
import { Title } from "./scenes/Title";
import { products, type ProductId } from "./content/products";
import { color } from "./theme";

export type DemoProps = {
  /** Highlighted Buildcage-step panel per workflow state; null where the step isn't in the workflow yet. */
  readonly buildcageSteps: (HighlightedCode | null)[] | null;
  /** Highlighted rest-of-workflow panel per workflow state. */
  readonly restSteps: HighlightedCode[] | null;
  /**
   * Drop the title card for the GIF cut. The outro stays either way — a GIF
   * loops with no controls and no gap, so the logo is what tells the viewer
   * where the thing ends and starts over.
   */
  readonly short: boolean;
  /** Which action's workflow the cut walks through. */
  readonly product: ProductId;
};

/** Scene lengths in frames at 30fps. */
export const sceneFrames = {
  title: 110,
  code: 105,
  run: 105,
  auditSummary: 165,
  restrictSummary: 135,
  outro: 75,
} as const;

export const totalFrames = (short: boolean, product: ProductId) => {
  const codeScenes = products[product].states.length * sceneFrames.code;
  const core =
    codeScenes + sceneFrames.run * 2 + sceneFrames.auditSummary + sceneFrames.restrictSummary;
  return core + sceneFrames.outro + (short ? 0 : sceneFrames.title);
};

export const Main: React.FC<DemoProps> = ({ buildcageSteps, restSteps, short, product }) => {
  if (!buildcageSteps || !restSteps) {
    throw new Error("steps were not computed — check calculateMetadata");
  }

  // The last state (restrict) is shown after the audit report, not in the
  // initial run of code beats.
  const layout = useLayout();
  const { states, runnerSteps } = products[product];
  const codeHeight = blockHeightFor(states, layout);
  const buildUpStates = states.slice(0, -1);
  const restrictState = states[states.length - 1];
  const restrictCode = restSteps[restSteps.length - 1];
  const restrictBuildcageCode = buildcageSteps[buildcageSteps.length - 1] ?? null;

  if (!restrictState || !restrictCode) {
    throw new Error("workflow states are missing the restrict step");
  }

  return (
    <AbsoluteFill style={{ background: color.heroBg }}>
      <Series>
        {short ? null : (
          <Series.Sequence durationInFrames={sceneFrames.title} name="Title">
            <Title />
          </Series.Sequence>
        )}

        {buildUpStates.map((state, i) => {
          const restCode = restSteps[i];
          if (!restCode) {
            throw new Error(`missing highlighted code for ${state.id}`);
          }
          return (
            <Series.Sequence
              key={state.id}
              durationInFrames={sceneFrames.code}
              name={state.id}
              layout="none"
            >
              <CodeScene
                heading={state.heading}
                note={state.note}
                titleEnters={buildUpStates[i - 1]?.heading !== state.heading}
                buildcageOld={i === 0 ? null : (buildcageSteps[i - 1] ?? null)}
                buildcageNew={buildcageSteps[i] ?? null}
                restOld={i === 0 ? null : (restSteps[i - 1] ?? null)}
                restNew={restCode}
                height={codeHeight}
              />
            </Series.Sequence>
          );
        })}

        <Series.Sequence durationInFrames={sceneFrames.run} name="run-audit" layout="none">
          <RunScene heading="Step 2 — Run it" note="nothing is blocked yet" steps={runnerSteps} contentHeight={codeHeight} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={sceneFrames.auditSummary}
          name="audit-report"
          layout="none"
        >
          <AuditSummaryScene heading="Buildcage wrote your allowlist" contentHeight={codeHeight} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sceneFrames.code} name={restrictState.id} layout="none">
          <CodeScene
            heading={restrictState.heading}
            note={restrictState.note}
            buildcageOld={buildcageSteps[buildcageSteps.length - 2] ?? null}
            buildcageNew={restrictBuildcageCode}
            restOld={restSteps[restSteps.length - 2] ?? null}
            restNew={restrictCode}
            height={codeHeight}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sceneFrames.run} name="run-restrict" layout="none">
          <RunScene heading="Run it again" note="this time in restrict mode" steps={runnerSteps} contentHeight={codeHeight} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={sceneFrames.restrictSummary}
          name="restrict-report"
          layout="none"
        >
          <RestrictSummaryScene heading="Anything else is blocked" contentHeight={codeHeight} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sceneFrames.outro} name="Outro">
          <Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
