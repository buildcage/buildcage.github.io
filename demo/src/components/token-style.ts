import type { TokenTransition } from "codehike/utils/token-transitions";
import { interpolate, interpolateColors } from "remotion";

/**
 * Applies one token's transition keyframes at a given progress.
 * Taken from Remotion's official Code Hike template (src/utils.ts).
 */
export function applyStyle({
  element,
  keyframes,
  progress,
  linearProgress,
}: {
  element: HTMLElement;
  keyframes: TokenTransition["keyframes"];
  progress: number;
  linearProgress: number;
}) {
  const { translateX, translateY, color, opacity } = keyframes;

  if (opacity) {
    // Follow the keyframes rather than progress itself. The template this came
    // from assumes opacity only ever runs 0 → 1, which is true of a token
    // arriving but backwards for one leaving: it faded the outgoing text in as
    // its replacement arrived, so a line that merely changed colour turned
    // muddy while both were on screen.
    element.style.opacity = interpolate(linearProgress, [0, 1], opacity).toString();
  }
  if (color) {
    element.style.color = interpolateColors(progress, [0, 1], color);
  }
  const x = translateX ? interpolate(progress, [0, 1], translateX) : 0;
  const y = translateY ? interpolate(progress, [0, 1], translateY) : 0;
  element.style.translate = `${x}px ${y}px`;
}
