import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { BuildSummaryCard, SectionLabel } from "../components/BuildSummaryCard";
import { Disclosure } from "../components/Disclosure";
import { HostsTable } from "../components/HostsTable";
import { SceneFrame } from "../components/SceneFrame";
import { useLayout } from "../layout";
import { auditedHosts } from "../content/report-data";
import { generatedConfig } from "../content/workflow-steps";
import { color, font, gh } from "../theme";

export const AuditSummaryScene: React.FC<{
  readonly heading: string;
  readonly contentHeight: number;
}> = ({ heading, contentHeight }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const openProgress = interpolate(frame, [40, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // A selection sweep across the generated config, then a "Copied" badge —
  // giving the paste in the next scene a visible copy moment to originate from.
  const selectProgress = interpolate(frame, [92, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeSpring = spring({
    frame: frame - 108,
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });

  return (
    <SceneFrame heading={heading} contentHeight={contentHeight} centered>
      <div
        style={{
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [24, 0])}px) scale(${layout.cardScale})`,
        }}
      >
        <BuildSummaryCard title="Outbound Traffic Report (audit mode)" width={layout.contentWidth}>
          <SectionLabel icon="📋">Audited Hosts</SectionLabel>
          <HostsTable
            columns={[
              { label: "Host", align: "left" },
              { label: "Rule", align: "center" },
              { label: "Count", align: "right" },
            ]}
            rows={auditedHosts.map((h) => [h.host, h.rule, h.count])}
          />

          <Disclosure
            label="Switch to restrict mode"
            icon="🛡️"
            progress={openProgress}
            bodyHeight={200}
          >
            <div style={{ position: "relative" }}>
              <pre
                style={{
                  margin: 0,
                  background: gh.headerBg,
                  border: `1px solid ${gh.border}`,
                  borderRadius: 8,
                  padding: "18px 22px",
                  fontFamily: font.mono,
                  fontSize: 23,
                  lineHeight: 1.55,
                  color: gh.fg,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: "10px 12px",
                    borderRadius: 4,
                    background: color.cyan,
                    opacity: 0.22 * selectProgress,
                    pointerEvents: "none",
                  }}
                />
                <span style={{ position: "relative" }}>{generatedConfig}</span>
              </pre>

              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: color.mint,
                  color: gh.fg,
                  fontFamily: font.body,
                  fontWeight: 500,
                  fontSize: 19,
                  opacity: badgeSpring,
                  transform: `translateY(${interpolate(badgeSpring, [0, 1], [8, 0])}px) scale(${interpolate(badgeSpring, [0, 1], [0.9, 1])})`,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                }}
              >
                <span>📋</span>
                <span>Copied</span>
              </div>
            </div>
          </Disclosure>
        </BuildSummaryCard>
      </div>
    </SceneFrame>
  );
};
