import React from "react";
import { Composition } from "remotion";

import { calculateMetadata } from "./calculate-metadata";
import { Main, totalFrames } from "./Main";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo"
        component={Main}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={totalFrames(false)}
        defaultProps={{ buildcageSteps: null, restSteps: null, short: false }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="DemoShort"
        component={Main}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={totalFrames(true)}
        defaultProps={{ buildcageSteps: null, restSteps: null, short: true }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
