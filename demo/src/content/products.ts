import { isolatedRunRunnerSteps, isolatedRunStates } from "./isolated-run-steps";
import {
  dockerRunnerSteps,
  workflowStates as dockerStates,
  type WorkflowState,
} from "./workflow-steps";

/**
 * The two actions share everything downstream of the workflow edit — the run,
 * the report, the allowlist it generates — so only the YAML on screen and the
 * step names in the run scene differ between cuts.
 */
export type ProductId = "docker" | "isolated-run";

export type Product = {
  readonly states: readonly WorkflowState[];
  readonly runnerSteps: readonly string[];
};

export const products: Readonly<Record<ProductId, Product>> = {
  docker: {
    states: dockerStates,
    runnerSteps: dockerRunnerSteps,
  },
  "isolated-run": {
    states: isolatedRunStates,
    runnerSteps: isolatedRunRunnerSteps,
  },
};
