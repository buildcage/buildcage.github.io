import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { BuildSummaryCard, SectionLabel } from "../components/BuildSummaryCard";
import { HostsTable } from "../components/HostsTable";
import { CONTENT_WIDTH, SceneFrame } from "../components/SceneFrame";
import { allowedHosts, blockedHosts } from "../content/report-data";

export const RestrictSummaryScene: React.FC<{ readonly heading: string }> = ({ heading }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const blockedIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  return (
    <SceneFrame heading={heading}>
      <div
        style={{
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [24, 0])}px)`,
        }}
      >
        <BuildSummaryCard title="Outbound Traffic Report (restrict mode)" width={CONTENT_WIDTH}>
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
