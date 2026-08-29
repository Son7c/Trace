import { NextResponse } from "next/server";

// Helper to extract slug from URL if user pastes a URL
function extractSlugFromUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed.includes("/")) return null;

  const match = trimmed.match(/\/problems\/([^\/]+)/);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  return null;
}

// Simple slugifier helper for direct slug attempts ("Two Sum" -> "two-sum")
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawInput = body?.urlOrSlug;

    if (!rawInput || (typeof rawInput !== "string" && typeof rawInput !== "number")) {
      return NextResponse.json(
        { error: "Missing or invalid urlOrSlug parameter" },
        { status: 400 }
      );
    }

    const cleanInput = String(rawInput).trim();
    const urlSlug = extractSlugFromUrl(cleanInput);
    const directSlugAttempt = urlSlug || slugify(cleanInput);

    // 1. DIRECT LOOKUP: If user passed URL or valid slug ("two-sum" or "Two Sum")
    if (directSlugAttempt) {
      const directRes = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
          query: `query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              title
              titleSlug
              difficulty
              topicTags { name slug }
            }
          }`,
          variables: { titleSlug: directSlugAttempt },
          operationName: "questionData",
        }),
      });

      const directData = await directRes.json();
      const question = directData?.data?.question;

      if (question) {
        return NextResponse.json({
          title: question.title,
          platform: "LEETCODE",
          difficulty: question.difficulty.toUpperCase(),
          tags: question.topicTags.map((t: { name: string }) => t.name),
          url: `https://leetcode.com/problems/${question.titleSlug}/`,
          questionId: question.questionId,
        });
      }
    }

    // 2. SEARCH BY RAW TITLE OR QUESTION NUMBER: Passes raw title ("Two Sum" or "1") to searchKeywords
    const searchTerm = cleanInput.replace(/^#/, "");
    const searchRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: `query problemsetQuestionList($filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: ""
            limit: 10
            skip: 0
            filters: $filters
          ) {
            questions: data {
              frontendQuestionId: questionFrontendId
              title
              titleSlug
              difficulty
              topicTags { name slug }
            }
          }
        }`,
        variables: {
          filters: { searchKeywords: searchTerm },
        },
        operationName: "problemsetQuestionList",
      }),
    });

    const searchData = await searchRes.json();
    const questions = searchData?.data?.problemsetQuestionList?.questions || [];

    if (questions.length === 0) {
      return NextResponse.json(
        { error: `Problem '${cleanInput}' not found on LeetCode` },
        { status: 404 }
      );
    }

    // Best match: exact title, exact question ID, or first search result
    const lowerSearch = searchTerm.toLowerCase();
    const matched =
      questions.find(
        (q: { title: string; frontendQuestionId: string }) =>
          q.title.toLowerCase() === lowerSearch ||
          q.frontendQuestionId === searchTerm
      ) || questions[0];

    return NextResponse.json({
      title: matched.title,
      platform: "LEETCODE",
      difficulty: matched.difficulty.toUpperCase(),
      tags: matched.topicTags.map((t: { name: string }) => t.name),
      url: `https://leetcode.com/problems/${matched.titleSlug}/`,
      questionId: matched.frontendQuestionId,
    });
  } catch (error) {
    console.error("LeetCode Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching question" },
      { status: 500 }
    );
  }
}
