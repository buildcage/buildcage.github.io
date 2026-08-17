import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";

/**
 * Loaded at module scope so the weights are registered before the first frame
 * renders — the landing page uses these same two families.
 */
export const outfit = loadOutfit("normal", { weights: ["400", "500"] });
export const rubik = loadRubik("normal", { weights: ["300", "400", "500"] });

export const waitForFonts = () => Promise.all([outfit.waitUntilDone(), rubik.waitUntilDone()]);
