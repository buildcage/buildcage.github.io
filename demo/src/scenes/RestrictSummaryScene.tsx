import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { BuildSummaryCard } from "../components/BuildSummaryCard";
import { AllowedHosts, BlockedHosts, RESTRICT_TITLE } from "../components/OutboundReport";
import { SceneFrame } from "../components/SceneFrame";
import { useLayout } from "../layout";

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
        <BuildSummaryCard title={RESTRICT_TITLE} width={layout.contentWidth}>
          <AllowedHosts />

          <div
            style={{
              opacity: blockedIn,
              transform: `translateY(${interpolate(blockedIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <BlockedHosts />
          </div>
        </BuildSummaryCard>
      </div>
    </SceneFrame>
  );
};
