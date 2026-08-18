import React from "react";
import { AbsoluteFill } from "remotion";

import { BuildSummaryCard } from "../components/BuildSummaryCard";
import { Tagline, Wordmark } from "../components/Lockup";
import { AllowedHosts, BlockedHosts, RESTRICT_TITLE } from "../components/OutboundReport";
import { useLayout } from "../layout";
import { color } from "../theme";

/**
 * The poster frame. It shows the report rather than the YAML — a table naming
 * one blocked host says what Buildcage is for; a screen of configuration
 * doesn't. Composed rather than grabbed from the timeline, so it isn't caught
 * mid-animation, and it leaves its centre clear for the page's play button.
 */
export const Poster: React.FC = () => {
  const layout = useLayout();

  const logo = <Wordmark width={layout.wide ? 250 : 170} />;

  const tagline = (
    <Tagline
      fontSize={40}
      fontWeight={500}
      align={layout.wide ? "center" : "left"}
      oneLine={!layout.wide}
      style={{ letterSpacing: -0.5, lineHeight: 1.25 }}
    />
  );

  // Wide: the line leads, the logo signs off under it. Narrow: the lockup
  // reads left to right along the top, as it does on the page.
  const lockup = (
    <div
      style={{
        display: "flex",
        flexDirection: layout.wide ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: layout.wide ? 64 : 24,
      }}
    >
      {layout.wide ? (
        <>
          {tagline}
          {logo}
        </>
      ) : (
        <>
          {logo}
          {tagline}
        </>
      )}
    </div>
  );

  const card = (
    <BuildSummaryCard title={RESTRICT_TITLE} width={layout.contentWidth}>
      <AllowedHosts />
      <BlockedHosts />
    </BuildSummaryCard>
  );

  return (
    <AbsoluteFill
      style={{
        background: color.heroBg,
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${layout.framePadding}px`,
      }}
    >
      {layout.wide ? (
        <div
          style={{ display: "flex", alignItems: "center", gap: layout.columnGap, width: "100%" }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{lockup}</div>
          <div style={{ flexShrink: 0 }}>{card}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {lockup}
          {card}
        </div>
      )}
    </AbsoluteFill>
  );
};
