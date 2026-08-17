import React from "react";
import { Composition } from "remotion";

import { calculateMetadata } from "./calculate-metadata";
import { Main, totalFrames } from "./Main";
import { Poster } from "./scenes/Poster";

/**
 * 4:3 rather than 16:9. The content is height-constrained — 22 lines of YAML
 * have to fit in the frame, which caps the font size — so a widescreen canvas
 * left roughly 40% of its width empty at every viewport size. Narrowing the
 * canvas makes the same type render larger without touching the layout.
 */
const WIDTH = 1440;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo"
        component={Main}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={totalFrames(false)}
        defaultProps={{ buildcageSteps: null, restSteps: null, short: false }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="DemoShort"
        component={Main}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={totalFrames(true)}
        defaultProps={{ buildcageSteps: null, restSteps: null, short: true }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="Poster"
        component={Poster}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={1}
        defaultProps={{ buildcageSteps: null, restSteps: null, short: false }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
