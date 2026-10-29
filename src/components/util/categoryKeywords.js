// src/components/util/categoryKeywords.js
//
// ONE place for category keywords. Both Search.jsx and the recommendation
// engine import from here, so the keyword list is never duplicated.

// Category -> keywords. Category names must match the `category` field in tools.js.
export const TASK_KEYWORDS = {
  Coding: ["code", "coding", "program", "programming", "debug", "developer", "website", "app", "apps"],
  Design: ["image", "design", "logo", "ui", "visual", "graphic", "photo", "art", "poster", "creative", "presentation", "slides", "pitch", "deck"],
  Writing: ["write", "writing", "article", "blog", "essay", "content", "copy", "script"],
  Research: ["research", "paper", "study", "summarize", "summary", "academic", "information", "sources", "learn", "course", "tutorial", "explain"],
  Video: ["video", "movie", "reel", "caption", "animation"],
  Marketing: ["marketing", "seo", "ads", "advertising", "campaign", "social", "brand"],
  Productivity: ["productivity", "workflow", "task", "automate", "notes", "organize"],
};

// Returns the categories a piece of text matches, e.g. "write or debug code"
// -> ["Coding", "Writing"]. Gibberish like "hdsyugf" returns [].
export function matchCategories(text) {
  const words = String(text).toLowerCase().split(/[^a-z]+/).filter(Boolean);

  return Object.entries(TASK_KEYWORDS)
    .filter(([, keywords]) =>
      keywords.some((kw) =>
        // short keywords ("ui", "art") must match exactly; longer ones may match word starts ("coding", "writes")
        words.some((w) => w === kw || (kw.length > 3 && w.startsWith(kw)))
      )
    )
    .map(([category]) => category);
}