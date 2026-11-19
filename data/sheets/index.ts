import { neetcode150 } from "./neetcode-150";
import { striverSdeSheet } from "./striver-sde";
import { striverA2ZSheet } from "./striver-a2z";
import { loveBabbarSheet } from "./love-babbar-450";
import { CuratedSheet } from "./types";

export * from "./types";
export { neetcode150, striverSdeSheet, striverA2ZSheet, loveBabbarSheet };

export const ALL_SHEETS: CuratedSheet[] = [
  neetcode150,
  striverSdeSheet,
  striverA2ZSheet,
  loveBabbarSheet,
];

export function getSheetById(id: string): CuratedSheet | undefined {
  return ALL_SHEETS.find((s) => s.sheetId === id);
}
