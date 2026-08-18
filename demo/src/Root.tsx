import React from "react";
import { Composition } from "remotion";

import { calculateMetadata } from "./calculate-metadata";
import { Main, totalFrames } from "./Main";
import { Poster } from "./scenes/Poster";
import type { ProductId } from "./content/products";

/**
 * The same scenes rendered into two frames; each lays itself out for its own
 * aspect ratio (see layout.ts) and the page picks whichever suits the screen.
 */
const WIDE = { width: 1920, height: 1080 } as const;
const NARROW = { width: 1440, height: 1080 } as const;

const props = (short: boolean, product: ProductId) => ({
  buildcageSteps: null,
  buildcagePlain: null,
  restSteps: null,
  restPlain: null,
  short,
  product,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Both cuts of the Docker walkthrough; the page swaps on viewport width. */}
      <Composition
        id="Demo"
        component={Main}
        fps={30}
        {...WIDE}
        durationInFrames={totalFrames(false, "docker")}
        defaultProps={props(false, "docker")}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="DemoNarrow"
        component={Main}
        fps={30}
        {...NARROW}
        durationInFrames={totalFrames(false, "docker")}
        defaultProps={props(false, "docker")}
        calculateMetadata={calculateMetadata}
      />
      <Composition id="Poster" component={Poster} fps={30} {...WIDE} durationInFrames={1} />
      <Composition id="PosterNarrow" component={Poster} fps={30} {...NARROW} durationInFrames={1} />

      {/* The README GIFs render at one size — a README column is fixed width. */}
      <Composition
        id="DemoShort"
        component={Main}
        fps={30}
        {...NARROW}
        durationInFrames={totalFrames(true, "docker")}
        defaultProps={props(true, "docker")}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="IsolatedRunShort"
        component={Main}
        fps={30}
        {...NARROW}
        durationInFrames={totalFrames(true, "isolated-run")}
        defaultProps={props(true, "isolated-run")}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
