export type SheetDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SheetPlatform = "LEETCODE" | "GFG" | "CODEFORCES" | "CODECHEF" | "HACKERRANK" | "OTHERS";

export interface SheetProblem {
  id: string;
  title: string;
  difficulty: SheetDifficulty;
  platform: SheetPlatform;
  url: string;
}

export interface SheetSection {
  topic: string;
  problems: SheetProblem[];
}

export interface CuratedSheet {
  sheetId: string;
  title: string;
  totalProblems: number;
  sections: SheetSection[];
}
