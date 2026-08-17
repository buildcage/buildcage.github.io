import type { HighlightedCode } from "codehike/code";
import React from "react";
import { AbsoluteFill, Series } from "remotion";

import { AuditSummaryScene } from "./scenes/AuditSummaryScene";
import { CodeScene } from "./scenes/CodeScene";
import { Outro } from "./scenes/Outro";
import { RestrictSummaryScene } from "./scenes/RestrictSummaryScene";
import { RunScene } from "./scenes/RunScene";
import { Title } from "./scenes/Title";
import { workflowStates } from "./content/workflow-steps";
import { color } from "./theme";

export type DemoProps = {
  /** Highlighted Buildcage-step panel per workflow state; null where the step isn't in the workflow yet. */
  readonly buildcageSteps: (HighlightedCode | null)[] | null;
  /** Highlighted rest-of-workflow panel per workflow state. */
  readonly restSteps: HighlightedCode[] | null;
  /** Trim the title/outro and the first code beat for the GIF cut. */
  readonly short: boolean;
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

export const totalFrames = (short: boolean) => {
  const codeScenes = workflowStates.length * sceneFrames.code;
  const core =
    codeScenes + sceneFrames.run * 2 + sceneFrames.auditSummary + sceneFrames.restrictSummary;
  return short ? core : core + sceneFrames.title + sceneFrames.outro;
};

export const Main: React.FC<DemoProps> = ({ buildcageSteps, restSteps, short }) => {
  if (!buildcageSteps || !restSteps) {
    throw new Error("steps were not computed — check calculateMetadata");
  }

  // The last state (restrict) is shown after the audit report, not in the
  // initial run of code beats.
  const buildUpStates = workflowStates.slice(0, -1);
  const restrictState = workflowStates[workflowStates.length - 1];
  const restrictCode = restSteps[restSteps.length - 1];
  const restrictBuildcageCode = buildcageSteps[buildcageSteps.length - 1];

  if (!restrictState || !restrictCode || !restrictBuildcageCode) {
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
                buildcageOld={i === 0 ? null : (buildcageSteps[i - 1] ?? null)}
                buildcageNew={buildcageSteps[i] ?? null}
                restOld={i === 0 ? null : (restSteps[i - 1] ?? null)}
                restNew={restCode}
              />
            </Series.Sequence>
          );
        })}

        <Series.Sequence durationInFrames={sceneFrames.run} name="run-audit" layout="none">
          <RunScene heading="Step 2 — Run it" note="nothing is blocked yet" />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={sceneFrames.auditSummary}
          name="audit-report"
          layout="none"
        >
          <AuditSummaryScene heading="Buildcage wrote your allowlist" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sceneFrames.code} name={restrictState.id} layout="none">
          <CodeScene
            heading={restrictState.heading}
            note={restrictState.note}
            buildcageOld={buildcageSteps[buildcageSteps.length - 2] ?? null}
            buildcageNew={restrictBuildcageCode}
            restOld={restSteps[restSteps.length - 2] ?? null}
            restNew={restrictCode}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sceneFrames.run} name="run-restrict" layout="none">
          <RunScene heading="Run it again" note="this time in restrict mode" />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={sceneFrames.restrictSummary}
          name="restrict-report"
          layout="none"
        >
          <RestrictSummaryScene heading="Anything else is blocked" />
        </Series.Sequence>

        {short ? null : (
          <Series.Sequence durationInFrames={sceneFrames.outro} name="Outro">
            <Outro />
          </Series.Sequence>
        )}
      </Series>
    </AbsoluteFill>
  );
};
