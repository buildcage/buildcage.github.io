import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { BuildSummaryCard, SectionLabel } from "../components/BuildSummaryCard";
import { HostsTable } from "../components/HostsTable";
import { SceneFrame } from "../components/SceneFrame";
import { useLayout } from "../layout";
import { allowedHosts, blockedHosts } from "../content/report-data";

export const RestrictSummaryScene: React.FC<{
  readonly heading: string;
  readonly contentHeight: number;
}> = ({ heading, contentHeight }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const blockedIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  return (
    <SceneFrame heading={heading} contentHeight={contentHeight} centered>
      <div
        style={{
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [24, 0])}px) scale(${layout.cardScale})`,
        }}
      >
        <BuildSummaryCard title="Outbound Traffic Report (restrict mode)" width={layout.contentWidth}>
          <SectionLabel icon="✅">Allowed Hosts</SectionLabel>
          <HostsTable
            columns={[
              { label: "Host", align: "left" },
              { label: "Rule", align: "center" },
              { label: "Count", align: "right" },
            ]}
            rows={allowedHosts.map((h) => [h.host, h.rule, h.count])}
          />

          <div
            style={{
              opacity: blockedIn,
              transform: `translateY(${interpolate(blockedIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <SectionLabel icon="🚫">Blocked Hosts</SectionLabel>
            <HostsTable
              columns={[
                { label: "Host", align: "left" },
                { label: "Rule", align: "center" },
                { label: "Reason", align: "center" },
                { label: "Count", align: "right" },
              ]}
              rows={blockedHosts.map((h) => [h.host, h.rule, h.reason, h.count])}
            />
          </div>
        </BuildSummaryCard>
      </div>
    </SceneFrame>
  );
};
