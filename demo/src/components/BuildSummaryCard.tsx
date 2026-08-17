import React from "react";

import { font, gh } from "../theme";

/**
 * Reproduction of GitHub's Job Summary card, matching the real reports captured
 * in ../../assets/report-{audit,restrict}-mode.png. Rendered rather than
 * screenshotted so the disclosure can actually open and its contents can morph
 * into the workflow editor in the next scene.
 */
export const BuildSummaryCard: React.FC<{
  readonly title: string;
  readonly children: React.ReactNode;
  readonly width?: number;
}> = ({ title, children, width = 1080 }) => {
  return (
    <div
      style={{
        width,
        background: gh.cardBg,
        border: `1px solid ${gh.border}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(0, 0, 0, 0.32)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: gh.headerBg,
          borderBottom: `1px solid ${gh.border}`,
          fontFamily: font.body,
          fontSize: 22,
          color: gh.fg,
        }}
      >
        <span>build summary</span>
        <span style={{ color: gh.muted, letterSpacing: 2 }}>•••</span>
      </div>

      <div style={{ padding: "24px 32px 28px" }}>
        <div
          style={{
            fontFamily: font.body,
            fontWeight: 600,
            fontSize: 34,
            color: gh.fg,
            paddingBottom: 14,
            borderBottom: `1px solid ${gh.border}`,
            marginBottom: 22,
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export const SectionLabel: React.FC<{
  readonly icon: string;
  readonly children: React.ReactNode;
}> = ({ icon, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: font.body,
      fontWeight: 600,
      fontSize: 26,
      color: gh.fg,
      marginBottom: 14,
    }}
  >
    <span>{icon}</span>
    <span>{children}</span>
  </div>
);
