import { Pre } from "codehike/code";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

import { CONTENT_WIDTH } from "../components/SceneFrame";
import { color, font } from "../theme";
import type { DemoProps } from "../Main";

const FONT_SIZE = 25;
const LINE_HEIGHT = FONT_SIZE * 1.5;

/**
 * The video's poster frame. Rendered statically rather than grabbed from the
 * timeline so it isn't tied to whatever a given frame happens to be
 * mid-animation, and so it can carry its own framing instead of a scene
 * heading that only makes sense in sequence.
 *
 * Centre-weighted content is avoided on purpose — the page overlays a play
 * button there.
 */
export const Poster: React.FC<DemoProps> = ({ buildcageSteps, restSteps }) => {
  if (!buildcageSteps || !restSteps) {
    throw new Error("steps were not computed — check calculateMetadata");
  }

  const buildcage = buildcageSteps[buildcageSteps.length - 1];
  const rest = restSteps[restSteps.length - 1];

  if (!buildcage || !rest) {
    throw new Error("the restrict state is missing");
  }

  const codeStyle: React.CSSProperties = {
    position: "relative",
    margin: 0,
    fontSize: FONT_SIZE,
    lineHeight: 1.5,
    fontFamily: font.mono,
    tabSize: 2,
  };

  return (
    <AbsoluteFill
      style={{
        background: color.heroBg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: CONTENT_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 34,
          }}
        >
          <Img src={staticFile("logo.png")} style={{ width: 150 }} />
          <div
            style={{
              fontFamily: font.heading,
              fontWeight: 500,
              fontSize: 40,
              color: color.fg,
              letterSpacing: -0.5,
              lineHeight: 1.3,
            }}
          >
            Network isolation for your build,
            <br />
            <span style={{ color: color.mint }}>in three steps</span>
          </div>
        </div>

        <div
          style={{
            width: CONTENT_WIDTH,
            background: color.codeBg,
            border: `1px solid ${color.rule}`,
            borderRadius: 14,
            padding: "30px 38px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: LINE_HEIGHT }}>
            <Pre code={buildcage} style={codeStyle} />
          </div>
          <Pre code={rest} style={codeStyle} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
