import React from "react";
import { Img } from "remotion";

import logoSrc from "../../../assets/logo.png";

import { color, font } from "../theme";

/**
 * The branding the video opens, closes and advertises itself with. Only the
 * pieces are shared, not their arrangement — the title card, outro and poster
 * each compose them differently, and set their own type. What must not differ
 * is the wording and the mark.
 */

export const Wordmark: React.FC<{
  readonly width: number;
  readonly style?: React.CSSProperties;
}> = ({ width, style }) => <Img src={logoSrc} style={{ width, ...style }} />;

export const Tagline: React.FC<{
  readonly fontSize: number;
  readonly fontWeight: number;
  readonly align?: React.CSSProperties["textAlign"];
  /** Set the line as one run of text instead of breaking after the comma. */
  readonly oneLine?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ fontSize, fontWeight, align = "center", oneLine = false, style }) => (
  <div
    style={{
      fontFamily: font.heading,
      fontWeight,
      fontSize,
      color: color.fg,
      textAlign: align,
      ...(oneLine ? { whiteSpace: "nowrap" as const } : {}),
      ...style,
    }}
  >
    Network isolation for your build,{oneLine ? " " : <br />}
    <span style={{ color: color.mint }}>in three steps</span>
  </div>
);
