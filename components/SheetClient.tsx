"use client";

import { getSheetById } from "@/data/sheets";
import Sheet from "./Sheet";

export default function SheetClient({
  sheetId,
  problems,
}: {
  sheetId: string;
  problems: string[];
}) {
  const sheet = getSheetById(sheetId);
  return <Sheet sheet={sheet} problems={problems} />;
}
