import type { HighlightedCode, Token } from "codehike/code";

/**
 * 1-based line numbers in `next` that have no counterpart in `prev` — the
 * lines a step adds or rewrites. A plain LCS is enough here: the snippets are
 * a couple of dozen lines.
 *
 * Lines are matched on their trimmed text, so a line that only shifts right —
 * a command nested one level deeper once its step is wrapped — counts as the
 * same line. It moved; the reader didn't write it, and colouring it as new
 * would point at the wrong thing.
 *
 * A line whose value changed still counts as new, key and all:
 * `proxy_mode: audit` becoming `proxy_mode: restrict` is the switch the whole
 * paste is for, and splitting the line's colour would play it down.
 */
export const addedLines = (prev: string | null, next: string): Set<number> => {
  const nextLines = next.split("\n").map((line) => line.trim());

  if (prev === null) {
    return new Set(nextLines.map((_, i) => i + 1));
  }

  const prevLines = prev.split("\n").map((line) => line.trim());
  const n = prevLines.length;
  const m = nextLines.length;

  // lcs[i][j] = length of the longest common subsequence of prev[i:] and next[j:]
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] =
        prevLines[i] === nextLines[j]
          ? lcs[i + 1]![j + 1]! + 1
          : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }

  const added = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (prevLines[i] === nextLines[j]) {
      i++;
      j++;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      i++;
    } else {
      added.add(j + 1);
      j++;
    }
  }
  while (j < m) {
    added.add(j + 1);
    j++;
  }

  return added;
};

const textOf = (token: Token | string) => (typeof token === "string" ? token : token[0]);

/**
 * Swaps the colour of every token sitting on one of `lines`, leaving the
 * tokenisation itself untouched. Recolouring the already-highlighted result
 * rather than highlighting a second time with a warm theme keeps both
 * versions token-for-token identical, which is what lets Code Hike match them
 * up and morph between scenes.
 */
export const recolorLines = (
  code: HighlightedCode,
  lines: ReadonlySet<number>,
  map: Readonly<Record<string, string>>,
): HighlightedCode => {
  if (lines.size === 0) {
    return code;
  }

  let line = 1;
  const tokens = code.tokens.map((token) => {
    const startLine = line;
    line += (textOf(token).match(/\n/g) ?? []).length;

    if (typeof token === "string" || !lines.has(startLine)) {
      return token;
    }

    const replacement = token[1] ? map[token[1].toUpperCase()] : undefined;
    return replacement ? ([token[0], replacement, token[2]] as Token) : token;
  });

  return { ...code, tokens };
};
