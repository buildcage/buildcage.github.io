import type { HighlightedCode, Token } from "codehike/code";

/**
 * 1-based line numbers in `next` with no counterpart in `prev` — what a step
 * adds or rewrites. LCS is plenty for snippets this size.
 *
 * Matched on trimmed text, so a line that only shifts right when its step is
 * wrapped counts as the same line: the reader didn't write it. A line whose
 * value changed counts as new key and all, since that change is the point.
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
 * Swaps the colour of tokens on `lines`, leaving tokenisation untouched.
 * Recolouring the highlighted result — rather than highlighting again with a
 * warm theme — keeps both versions token-for-token identical, which is what
 * lets Code Hike match them.
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
