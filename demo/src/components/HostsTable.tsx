import React from "react";

import { font, gh } from "../theme";

export type Column = { readonly label: string; readonly align: "left" | "center" | "right" };

/**
 * Rows are styled exactly as GitHub renders them in the Job Summary — no
 * emphasis of our own on the blocked row. The real report doesn't tint or
 * recolour it (see ../../assets/report-restrict-mode.png), and inventing a
 * treatment here would show viewers an interface they'll never get.
 */
export const HostsTable: React.FC<{
  readonly columns: readonly Column[];
  readonly rows: readonly (readonly (string | number)[])[];
}> = ({ columns, rows }) => {
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
        {rows.map((row, i) => (
          <tr key={row.join("|")}>
            {row.map((value, j) => (
              <td
                key={columns[j]?.label ?? j}
                style={{
                  ...cell,
                  textAlign: columns[j]?.align ?? "left",
                  background: i % 2 === 1 ? gh.rowAlt : gh.cardBg,
                }}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
