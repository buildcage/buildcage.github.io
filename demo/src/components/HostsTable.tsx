import React from "react";

import { font, gh } from "../theme";

type Column = { readonly label: string; readonly align: "left" | "center" | "right" };

export const HostsTable: React.FC<{
  readonly columns: readonly Column[];
  readonly rows: readonly (readonly (string | number)[])[];
  /** 0-based row index revealed with a highlight, for the blocked row. */
  readonly highlightRow?: number | null;
  readonly highlightProgress?: number;
}> = ({ columns, rows, highlightRow = null, highlightProgress = 0 }) => {
  const cell: React.CSSProperties = {
    border: `1px solid ${gh.border}`,
    padding: "10px 16px",
    fontFamily: font.body,
    fontSize: 20,
    color: gh.fg,
  };

  return (
    <table style={{ borderCollapse: "collapse", marginBottom: 20 }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.label}
              style={{
                ...cell,
                background: gh.cardBg,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const highlighted = highlightRow === i;
          return (
            <tr key={row.join("|")}>
              {row.map((value, j) => (
                <td
                  key={columns[j]?.label ?? j}
                  style={{
                    ...cell,
                    textAlign: columns[j]?.align ?? "left",
                    background: highlighted
                      ? `rgba(209, 36, 47, ${0.09 * highlightProgress})`
                      : i % 2 === 1
                        ? gh.rowAlt
                        : gh.cardBg,
                    color: highlighted && j === 0 ? gh.danger : gh.fg,
                    fontWeight: highlighted && j === 0 ? 500 : 400,
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
