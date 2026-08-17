/**
 * Design tokens lifted from the landing page's style.css (dark palette), so the
 * video reads as the same product as buildcage.github.io.
 */

export const color = {
  heroBg: "#223133",
  brandBg: "#2a3c40",
  cyan: "#53b1bd",
  mint: "#88ebb9",
  fg: "#e6eeec",
  muted: "#9aabab",
  rule: "#2c3b3c",
  codeBg: "#1d2a2b",
} as const;

/** The GitHub Job Summary card is rendered light, the way it looks on github.com. */
export const gh = {
  cardBg: "#ffffff",
  headerBg: "#f6f8fa",
  border: "#d1d9e0",
  fg: "#1f2328",
  muted: "#59636e",
  rowAlt: "#f6f8fa",
  danger: "#d1242f",
} as const;

export const font = {
  heading: "Outfit",
  body: "Rubik",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

/**
 * Shiki-compatible theme handed to codehike's `highlight()`. Verified to be
 * accepted as a plain object — the token colors mirror the `.k` / `.s` / `.a` /
 * `.c` / `.p` classes the landing page uses for its YAML snippets.
 */
export const codeTheme = {
  name: "buildcage-dark",
  type: "dark",
  colors: {
    "editor.background": color.codeBg,
    "editor.foreground": color.fg,
  },
  tokenColors: [
    {
      scope: ["entity.name.tag.yaml", "entity.name.tag", "keyword"],
      settings: { foreground: "#6cc6d2" },
    },
    {
      scope: ["string", "string.unquoted", "string.quoted"],
      settings: { foreground: "#8fe0b4" },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#7a8b8d" },
    },
    {
      scope: ["punctuation", "meta.separator"],
      settings: { foreground: "#7a8b8d" },
    },
  ],
} as const;
