import type { Column } from "../components/HostsTable";

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

/**
 * Column headings for the two shapes of row above. They describe the data, so
 * they belong beside it — the audit, restrict and poster cards all render the
 * same tables and were each carrying their own copy of these.
 */
export const hostColumns: readonly Column[] = [
  { label: "Host", align: "left" },
  { label: "Rule", align: "center" },
  { label: "Count", align: "right" },
];

export const blockedColumns: readonly Column[] = [
  { label: "Host", align: "left" },
  { label: "Rule", align: "center" },
  { label: "Reason", align: "center" },
  { label: "Count", align: "right" },
];
