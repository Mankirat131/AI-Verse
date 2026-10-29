// src/components/util/recommendationEngine.js
//
// All the scoring logic lives here (no React), so it is easy to explain:
//
//   1. Turn the raw events into categories (gibberish searches match nothing and are ignored)
//   2. Score each category:  tool view = 1,  valid search = 2,  saved tool = 3
//   3. Convert scores to percentages (they always add up to 100)
//   4. Recommend tools from the highest-scoring categories first,
//      skipping tools the user has already viewed 3+ times
//   5. Every recommendation gets a reason built from real activity
//   6. Fewer than 3 valid activities -> show popular tools instead

import { TASK_KEYWORDS, matchCategories } from "./categoryKeywords";

const WEIGHTS = { view: 1, category: 1, search: 2, saved: 3 };
const MIN_ACTIVITIES = 3;
const MAX_REPEAT_VIEWS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

// Turns [5, 3, 2] into whole percentages that add up to exactly 100.
function toPercents(values) {
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total === 0) return values.map(() => 0);

  const raw = values.map((v) => (v / total) * 100);
  const percents = raw.map(Math.floor);
  const missing = 100 - percents.reduce((sum, v) => sum + v, 0);

  raw
    .map((r, i) => ({ i, remainder: r - percents[i] }))
    .sort((a, b) => b.remainder - a.remainder)
    .slice(0, missing)
    .forEach(({ i }) => percents[i]++);

  return percents;
}

// Picks the strongest piece of evidence for a category and words it.
function buildReason(evidence, category) {
  const options = [];

  const [topTool, topCount] = Object.entries(evidence.views).sort((a, b) => b[1] - a[1])[0] || [];
  if (topTool) {
    options.push({
      points: topCount * WEIGHTS.view,
      text: `Because you viewed ${topTool} ${topCount} ${topCount === 1 ? "time" : "times"}`,
    });
  }
  if (evidence.searches.length) {
    const lastSearch = evidence.searches[evidence.searches.length - 1];
    options.push({ points: evidence.searches.length * WEIGHTS.search, text: `Because you searched "${lastSearch}"` });
  }
  if (evidence.saved.length) {
    options.push({ points: evidence.saved.length * WEIGHTS.saved, text: `Because you saved ${evidence.saved[0]}` });
  }

  options.sort((a, b) => b.points - a.points);
  return options[0]?.text || `Because you explored ${category}`;
}

// 75 -> "1m 15s", 3700 -> "1h 1m"
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

// Last 7 days (oldest -> today) with the number of actions on each day.
function getWeeklyActivity(events, now) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today);
    start.setDate(start.getDate() - (6 - i));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
      label: start.toLocaleDateString("en-US", { weekday: "short" }),
      count: events.filter((e) => e.type !== "visit" && e.time >= start.getTime() && e.time < end.getTime()).length,
    };
  });
}

// Used by the Recent Activity list: hides gibberish searches.
export function isUsefulLogEntry(message) {
  const search = message.match(/^Searched "(.*)"$/);
  return search ? matchCategories(search[1]).length > 0 : true;
}

export function getRecommendations({ activity, tools, savedTools = [], rangeDays = 7, now = Date.now() }) {
  const toolCategory = Object.fromEntries(tools.map((t) => [t.name, t.category]));
  const categories = [...new Set([...Object.keys(TASK_KEYWORDS), ...tools.map((t) => t.category)])];

  // 1. Attach categories + age to every event
  const events = (activity.events || []).map((e) => {
    const time = new Date(e.date).getTime();
    let matched = [];
    if (e.type === "view") matched = [toolCategory[e.name] || e.category].filter(Boolean);
    if (e.type === "search") matched = matchCategories(e.query || ""); // gibberish -> []
    if (e.type === "category") matched = [e.category];
    return { ...e, time, age: now - time, categories: matched };
  });

  // Date-range windows: current period vs the period before it (for trend badges)
  const range = rangeDays * DAY_MS;
  const current = events.filter((e) => e.age <= range);
  const previous = events.filter((e) => e.age > range && e.age <= range * 2);
  const countViews = (list) => list.filter((e) => e.type === "view").length;
  const countSearches = (list) => list.filter((e) => e.type === "search" && e.categories.length > 0).length;

  // 2. Score categories + remember the evidence for each reason
  const scores = Object.fromEntries(categories.map((c) => [c, 0]));
  const evidence = Object.fromEntries(categories.map((c) => [c, { views: {}, searches: [], saved: [] }]));
  let validActivities = 0;

  current.forEach((e) => {
    if (e.categories.length === 0) return;
    validActivities++;

    e.categories.forEach((cat) => {
      if (!(cat in scores)) return;
      scores[cat] += WEIGHTS[e.type];
      if (e.type === "view") evidence[cat].views[e.name] = (evidence[cat].views[e.name] || 0) + 1;
      if (e.type === "search") evidence[cat].searches.push(e.query.trim());
    });
  });

  savedTools.forEach((name) => {
    const cat = toolCategory[name];
    if (!cat) return;
    scores[cat] += WEIGHTS.saved;
    evidence[cat].saved.push(name);
    validActivities++;
  });

  // 3. Profile: every category, as percentages
  const profilePercents = toPercents(categories.map((c) => scores[c]));
  const profile = categories
    .map((category, i) => ({ category, score: scores[category], percent: profilePercents[i] }))
    .sort((a, b) => b.score - a.score);

  // Time on tools: add up the estimated seconds of every "visit" in the date range
  const secondsByTool = {};
  current.forEach((ev) => {
    if (ev.type === "visit") secondsByTool[ev.name] = (secondsByTool[ev.name] || 0) + ev.seconds;
  });
  const sortedTime = Object.entries(secondsByTool)
    .map(([name, seconds]) => ({ name, seconds }))
    .sort((x, y) => y.seconds - x.seconds);
  const shownTime = sortedTime.slice(0, 5); // top 5 tools, the rest become "Other"
  const otherSeconds = sortedTime.slice(5).reduce((sum, item) => sum + item.seconds, 0);
  if (otherSeconds > 0) shownTime.push({ name: "Other", seconds: otherSeconds });
  const timePercents = toPercents(shownTime.map((item) => item.seconds));
  const toolTime = {
    totalSeconds: sortedTime.reduce((sum, item) => sum + item.seconds, 0),
    items: shownTime.map((item, i) => ({ ...item, percent: timePercents[i] })),
  };

  // 4. Recommendations
  const isFallback = validActivities < MIN_ACTIVITIES;
  const allTimeViews = activity.toolClicks || {};
  const byRating = (a, b) => (b.rating || 0) - (a.rating || 0);
  const fresh = tools.filter((t) => (allTimeViews[t.name] || 0) < MAX_REPEAT_VIEWS); // not viewed 3+ times
  const picks = [];

  const add = (tool, matchScore, reason) => {
    if (picks.length < 3 && !picks.some((p) => p.name === tool.name)) {
      picks.push({ ...tool, matchScore, reason });
    }
  };

  if (!isFallback) {
    const ranked = profile.filter((p) => p.score > 0);
    const toolsIn = (cat) => fresh.filter((t) => t.category === cat).sort(byRating);
    // Match % grows with how much of the profile the category makes up (max 98)
    const matchFor = (p) => Math.min(98, 55 + Math.round(p.percent * 0.4));

    // Pass 1: best tool from each of the top categories (highest first)
    ranked.forEach((p) => {
      const [best] = toolsIn(p.category);
      if (best) add(best, matchFor(p), buildReason(evidence[p.category], p.category));
    });
    // Pass 2: still short? more tools from the top categories
    ranked.forEach((p) =>
      toolsIn(p.category).forEach((t) => add(t, matchFor(p), buildReason(evidence[p.category], p.category)))
    );
  }

  // Fallback / padding: popular tools (no match % because it isn't personalised)
  [...fresh].sort(byRating).forEach((t) => add(t, null, "Popular on AI-Verse"));

  // 5. Numbers for the dashboard
  const topTools = Object.entries(allTimeViews)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    views: countViews(current),
    prevViews: countViews(previous),
    searches: countSearches(current),
    prevSearches: countSearches(previous),
    validActivities,
    confidence: Math.min(100, validActivities * 10),
    topCategory: profile[0].score > 0 ? profile[0].category : "None yet",
    topPercent: profile[0].percent,
    profile,
    toolTime,
    weekly: getWeeklyActivity(events, now),
    recommendations: picks,
    isFallback,
    topTools,
  };
}