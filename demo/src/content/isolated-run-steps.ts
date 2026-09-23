import { generatedConfig, type WorkflowState } from "./workflow-steps";

/**
 * The isolated-run cut. The action wraps the command, runs it and appends its
 * own report, so unlike the Docker flow there's no builder to point at and no
 * report step — the whole edit happens inside one workflow step. A checkout
 * step rides along untouched, to read the recoloured lines against.
 */

const checkoutStep = `- name: Check out
  uses: actions/checkout@<sha> # v6.x.x`;

const plainStep = `- name: Build and test
  run: |
    npm ci
    npm run build
    npm run test`;

// Configuration accumulates below the command, so pasting the allowlist back
// appends to the step rather than pushing the command down mid-block.
const wrappedStep = (config: string) => `- name: Build and test
  uses: buildcage/isolated-run@<sha> # v1.x.x
  with:
    run: |
      npm ci
      npm run build
      npm run test
${config
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}`;

const auditStep = wrappedStep("proxy_mode: audit");
const restrictStep = wrappedStep(generatedConfig);

export const isolatedRunStates: readonly WorkflowState[] = [
  {
    id: "base",
    heading: "You already have this",
    buildcageYaml: null,
    restYaml: [checkoutStep, plainStep].join("\n\n"),
  },
  {
    id: "audit",
    heading: "Step 1 — Wrap the step",
    note: "in audit mode, nothing is blocked",
    buildcageYaml: null,
    restYaml: [checkoutStep, auditStep].join("\n\n"),
  },
  {
    id: "restrict",
    heading: "Step 3 — Paste it back",
    note: "the allowlist is now enforced",
    buildcageYaml: null,
    restYaml: [checkoutStep, restrictStep].join("\n\n"),
  },
];

export const isolatedRunRunnerSteps: readonly string[] = ["Check out", "Build and test"];
