// src/utils/activityTracker.js
//
// Simple localStorage-based activity tracker for AI-Verse.
// No hooks, no Context — just plain functions that read/write one
// localStorage key. Call these from your existing pages whenever
// something happens (a tool is clicked, a search runs, a category is opened).

const STORAGE_KEY = "aiverse_activity";

// Shape of the data we store:
// {
//   toolClicks: { "ChatGPT": 3, "Claude": 1 },
//   categoryVisits: { "Writing": 4, "Coding": 2 },
//   searchCount: 5,
//   recentLog: [ { message: "Viewed ChatGPT", date: "2026-08-24T..." }, ... ]
// }

function getActivity() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      toolClicks: {},
      categoryVisits: {},
      searchCount: 0,
      recentLog: [],
    };
  }

  return JSON.parse(raw);
}

function saveActivity(activity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
}

function addLogEntry(activity, message) {
  activity.recentLog.unshift({
    message: message,
    date: new Date().toISOString(),
  });

  // keep only the most recent 15 entries so localStorage doesn't grow forever
  activity.recentLog = activity.recentLog.slice(0, 15);
}

// Call this whenever the user opens/clicks a tool card (Search, Home, Categories, ToolDetails)
export function logToolClick(tool) {
  const activity = getActivity();

  activity.toolClicks[tool.name] = (activity.toolClicks[tool.name] || 0) + 1;
  activity.categoryVisits[tool.category] =
    (activity.categoryVisits[tool.category] || 0) + 1;

  addLogEntry(activity, `Viewed ${tool.name}`);
  saveActivity(activity);
}

// Call this whenever the user runs a search
export function logSearch(query) {
  const activity = getActivity();

  activity.searchCount += 1;
  addLogEntry(activity, `Searched "${query}"`);

  saveActivity(activity);
}

// Call this whenever the user opens a category filter/page
export function logCategoryVisit(category) {
  const activity = getActivity();

  activity.categoryVisits[category] = (activity.categoryVisits[category] || 0) + 1;
  addLogEntry(activity, `Explored ${category}`);

  saveActivity(activity);
}

// Used by the Recommendations page to read everything at once
export function getActivityData() {
  return getActivity();
}

// Optional: useful while testing, or as a "reset my data" button
export function clearActivity() {
  localStorage.removeItem(STORAGE_KEY);
}