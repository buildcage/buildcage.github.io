import React from "react";
import { Composition } from "remotion";

import { calculateMetadata } from "./calculate-metadata";
import { Main, totalFrames } from "./Main";
import { Poster } from "./scenes/Poster";
import type { ProductId } from "./content/products";

/**
 * 4:3 rather than 16:9. The content is height-constrained — 22 lines of YAML
 * have to fit in the frame, which caps the font size — so a widescreen canvas
 * left roughly 40% of its width empty at every viewport size. Narrowing the
 * canvas makes the same type render larger without touching the layout.
 */
const WIDTH = 1440;
const HEIGHT = 1080;

const props = (short: boolean, product: ProductId) => ({
  buildcageSteps: null,
  restSteps: null,
  short,
  product,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* The landing page embeds the Docker cut; the README GIFs are the short
          cuts, one per action. isolated-run gets no full video — its README is
          the only place it's used. */}
      <Composition
        id="Demo"
        component={Main}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={totalFrames(false, "docker")}
        defaultProps={props(false, "docker")}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="DemoShort"
        component={Main}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={totalFrames(true, "docker")}
        defaultProps={props(true, "docker")}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="IsolatedRunShort"
        component={Main}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={totalFrames(true, "isolated-run")}
        defaultProps={props(true, "isolated-run")}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="Poster"
        component={Poster}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={1}
        defaultProps={props(false, "docker")}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
