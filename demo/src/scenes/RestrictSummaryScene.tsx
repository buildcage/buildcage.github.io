import React, { useLayoutEffect, useRef, useState } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

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
  // The card grows, pushing the allowed table down, and each part starts to
  // fade in as soon as the growth has made room for it.
  const growAt = (f: number) =>
    interpolate(f, [22, 46], [0, 1], {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const blockedGrow = growAt(frame);

  const revealRef = useRef<HTMLDivElement>(null);
  const blockedRef = useRef<HTMLDivElement>(null);
  const [cautionShare, setCautionShare] = useState(0.4);
  useLayoutEffect(() => {
    const total = revealRef.current?.scrollHeight;
    const cautionEnd = blockedRef.current?.offsetTop;
    if (total && cautionEnd) setCautionShare(cautionEnd / total);
  });

  // The first frame the grown height reaches the given share of the full one.
  // The growth crawls over its last few percent, so "all of it" starts at 95%.
  const roomAt = (share: number) => {
    let f = 22;
    while (growAt(f) < Math.min(share, 0.95)) f++;
    return f;
  };
  const fadeFrom = (start: number) =>
    spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 20 });
  const cautionIn = fadeFrom(roomAt(cautionShare));
  const blockedIn = fadeFrom(roomAt(1));
  const fadeUp = (progress: number): React.CSSProperties => ({
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [16, 0])}px)`,
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
            <div ref={revealRef} style={{ overflow: "hidden", minHeight: 0, position: "relative" }}>
              <div style={fadeUp(cautionIn)}>
                <BlockedCaution />
              </div>
              <div ref={blockedRef} style={fadeUp(blockedIn)}>
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
