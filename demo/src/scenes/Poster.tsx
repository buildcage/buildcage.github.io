import React from "react";
import { AbsoluteFill } from "remotion";

import { BuildSummaryCard } from "../components/BuildSummaryCard";
import { Tagline, Wordmark } from "../components/Lockup";
import { AllowedHosts, BlockedHosts, RESTRICT_TITLE } from "../components/OutboundReport";
import { useLayout } from "../layout";
import { color } from "../theme";

/**
 * The video's poster frame. It shows the report rather than the workflow YAML:
 * the report is what the tool produces, and a table naming one blocked host
 * says what Buildcage is for in a way a screen of configuration doesn't.
 *
 * Rendered statically rather than grabbed from the timeline, so it isn't tied
 * to whatever a given frame happens to be mid-animation. Laid out for its own
 * aspect ratio, like the scenes — the wide poster sets the lockup beside the
 * report, the narrow one stacks them. Centre-weighted content is avoided on
 * purpose: the page overlays a play button there.
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

  // Wide: the line leads and the logo signs off under it, the pair centred in
  // the column beside the report. Narrow: the lockup reads left to right along
  // the top, the way it does on the page.
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
