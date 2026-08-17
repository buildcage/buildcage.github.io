/**
 * The rows shown in the reproduced Job Summary cards. Kept in sync with the
 * real reports captured in ../../assets/report-{audit,restrict}-mode.png.
 */

export type HostRow = {
  readonly host: string;
  readonly rule: string;
  readonly count: number;
};

export type BlockedRow = HostRow & { readonly reason: string };

export const auditedHosts: readonly HostRow[] = [
  { host: "registry.npmjs.org:443", rule: "HTTPS", count: 16 },
  { host: "fonts.googleapis.com:443", rule: "HTTPS", count: 2 },
];

export const allowedHosts = auditedHosts;

export const blockedHosts: readonly BlockedRow[] = [
  { host: "www.example.com:80", rule: "HTTP", reason: "not-allowed", count: 1 },
];

export const reportNote =
  "Note: HTTP rules are based on the Host header, HTTPS rules on SNI, and IP rules on the destination IP address.";

/** The runner steps ticked through in the stylized run scene. */
export const runnerSteps: readonly string[] = [
  "Start Buildcage",
  "Set up Docker Buildx",
  "Build",
  "Show Buildcage report",
];
