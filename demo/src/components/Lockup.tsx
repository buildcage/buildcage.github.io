import React from "react";
import { Img } from "remotion";

import logoSrc from "../../../assets/logo.png";

import { color, font } from "../theme";

/**
 * The two pieces of branding the video opens, closes and advertises itself
 * with. Only the pieces are shared, not their arrangement: the title card
 * stacks them and animates them in sequence, the outro shows the mark alone,
 * and the poster reorders them per aspect ratio. What must not differ is the
 * wording and the mark itself, which is why they live here and nowhere else.
 *
 * Typography beyond family and colour is left to the caller — the title card
 * sets the line large and loose, the poster small and tight — so each keeps
 * the setting it was composed with.
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
