import React from "react";

import { SectionLabel } from "./BuildSummaryCard";
import { HostsTable } from "./HostsTable";
import { allowedHosts, blockedColumns, blockedHosts, hostColumns } from "../content/report-data";
import { font, gh } from "../theme";

/**
 * The restrict-mode report, shown by the closing scene and by the poster. They
 * differ only in that the scene fades the caution and the blocked table in.
 */

export const RESTRICT_TITLE = "Outbound Traffic Report";

/** GitHub's octicon "stop", the icon of a `[!CAUTION]` alert. */
const StopIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
  </svg>
);

export const BlockedCaution: React.FC = () => {
  const count = blockedHosts.reduce((total, h) => total + h.count, 0);
  return (
    <div
      style={{
        borderLeft: `4px solid ${gh.caution}`,
        padding: "6px 18px",
        marginBottom: 22,
        fontFamily: font.body,
        fontSize: 20,
        color: gh.fg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: gh.caution,
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        <StopIcon />
        <span>Caution</span>
      </div>
      <div>{count} blocked</div>
    </div>
  );
};

export const BlockedHosts: React.FC = () => (
  <>
    <SectionLabel icon="🚫">Blocked Hosts</SectionLabel>
    <HostsTable
      columns={blockedColumns}
      rows={blockedHosts.map((h) => [h.host, h.rule, h.reason, h.count])}
    />
  </>
);

export const AllowedHosts: React.FC = () => (
  <>
    <SectionLabel icon="✅">Allowed Hosts</SectionLabel>
    <HostsTable columns={hostColumns} rows={allowedHosts.map((h) => [h.host, h.rule, h.count])} />
  </>
);
