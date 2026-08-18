import React from "react";
import { AbsoluteFill, Img } from "remotion";

import logoSrc from "../../../assets/logo.png";

import { BuildSummaryCard, SectionLabel } from "../components/BuildSummaryCard";
import { HostsTable } from "../components/HostsTable";
import { allowedHosts, blockedHosts } from "../content/report-data";
import { useLayout } from "../layout";
import { color, font } from "../theme";

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

  const logo = <Img src={logoSrc} style={{ width: layout.wide ? 250 : 170 }} />;

  const tagline = (
    <div
      style={{
        fontFamily: font.heading,
        fontWeight: 500,
        fontSize: 40,
        color: color.fg,
        letterSpacing: -0.5,
        lineHeight: 1.25,
        textAlign: layout.wide ? "center" : "left",
        ...(layout.wide ? {} : { whiteSpace: "nowrap" as const }),
      }}
    >
      Network isolation for your build,{layout.wide ? <br /> : " "}
      <span style={{ color: color.mint }}>in three steps</span>
    </div>
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
