import React from "react";

import { SectionLabel } from "./BuildSummaryCard";
import { HostsTable } from "./HostsTable";
import { allowedHosts, blockedColumns, blockedHosts, hostColumns } from "../content/report-data";

/**
 * The restrict-mode report, which two places show: the scene at the end of the
 * walkthrough and the poster frame the page uses as its thumbnail. They differ
 * only in that the scene fades the blocked table in — everything else was
 * duplicated, down to the card's title.
 */

export const RESTRICT_TITLE = "Outbound Traffic Report (restrict mode)";

export const AllowedHosts: React.FC = () => (
  <>
    <SectionLabel icon="✅">Allowed Hosts</SectionLabel>
    <HostsTable columns={hostColumns} rows={allowedHosts.map((h) => [h.host, h.rule, h.count])} />
  </>
);

export const BlockedHosts: React.FC = () => (
  <>
    <SectionLabel icon="🚫">Blocked Hosts</SectionLabel>
    <HostsTable
      columns={blockedColumns}
      rows={blockedHosts.map((h) => [h.host, h.rule, h.reason, h.count])}
    />
  </>
);
