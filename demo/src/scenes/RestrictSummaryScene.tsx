import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { BuildSummaryCard } from "../components/BuildSummaryCard";
import {
  AllowedHosts,
  BlockedCaution,
  BlockedHosts,
  RESTRICT_TITLE,
} from "../components/OutboundReport";
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
  // The card grows first, pushing the allowed table down, and the blocking part
  // fades into the room that opens above it.
  const blockedGrow = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const blockedIn = spring({
    frame: frame - 32,
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
          {/* A 0fr to 1fr row animates the height without measuring it. */}
          <div style={{ display: "grid", gridTemplateRows: `${blockedGrow}fr` }}>
            <div style={{ overflow: "hidden", minHeight: 0 }}>
              <div
                style={{
                  opacity: blockedIn,
                  transform: `translateY(${interpolate(blockedIn, [0, 1], [16, 0])}px)`,
                }}
              >
                <BlockedCaution />
                <BlockedHosts />
              </div>
            </div>
          </div>

          <AllowedHosts />
        </BuildSummaryCard>
      </div>
    </SceneFrame>
  );
};
