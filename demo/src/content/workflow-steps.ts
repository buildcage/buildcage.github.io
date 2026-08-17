/**
 * Single source of truth for the workflow YAML shown in the video.
 *
 * Split into two independent tracks — the Buildcage step itself, and the rest
 * of the workflow (buildx / build / report) — so each is diffed and morphed
 * independently. This keeps the Buildcage step's changes from ever displacing
 * (and thus animating) the unrelated, unchanged steps around it.
 */

const buildcageStep = (body: string) => `- name: Start Buildcage
  uses: buildcage/docker@<sha> # v3.x.x
  with:
${body}`;

const auditBuildcage = buildcageStep(`    proxy_mode: audit`);

/** The block the audit report hands you, shown inside the Job Summary card. */
export const generatedConfig = `proxy_mode: restrict
allowed_https_rules: |
  registry.npmjs.org:443
  fonts.googleapis.com:443`;

const restrictBuildcage = buildcageStep(
  generatedConfig
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n"),
);

const buildxStep = (withBlock: string) => `- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@<sha> # v4.x.x${withBlock}`;

const buildStep = `- name: Build
  uses: docker/build-push-action@<sha> # v7.x.x
  with:
    context: .`;

const reportStep = `- name: Show Buildcage report
  if: always()
  uses: buildcage/docker/report@<sha> # v3.x.x`;

const plainBuildx = buildxStep("");

const remoteBuildx = buildxStep(`
  with:
    driver: remote
    endpoint: docker-container://buildcage`);

export type WorkflowState = {
  readonly id: string;
  readonly heading: string | null;
  /** null = the Buildcage step isn't in the workflow yet. */
  readonly buildcageYaml: string | null;
  readonly restYaml: string;
};

export const workflowStates: readonly WorkflowState[] = [
  {
    id: "base",
    heading: "You already have this",
    buildcageYaml: null,
    restYaml: [plainBuildx, buildStep].join("\n\n"),
  },
  {
    id: "audit",
    heading: "Step 1 — Start Buildcage in audit mode",
    buildcageYaml: auditBuildcage,
    restYaml: [plainBuildx, buildStep].join("\n\n"),
  },
  {
    id: "remote-driver",
    heading: "Step 2 — Point Buildx at it",
    buildcageYaml: auditBuildcage,
    restYaml: [remoteBuildx, buildStep].join("\n\n"),
  },
  {
    id: "report",
    heading: "Step 3 — Show the report",
    buildcageYaml: auditBuildcage,
    restYaml: [remoteBuildx, buildStep, reportStep].join("\n\n"),
  },
  {
    id: "restrict",
    heading: "Paste it back",
    buildcageYaml: restrictBuildcage,
    restYaml: [remoteBuildx, buildStep, reportStep].join("\n\n"),
  },
];
