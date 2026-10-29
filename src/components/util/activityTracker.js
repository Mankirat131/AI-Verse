// src/components/util/activityTracker.js
//
// Simple localStorage activity tracker for AI-Verse (plain functions, no hooks).
//
// Stored shape:
// {
//   toolClicks:     { "PixelForge": 5 },          // all-time view count per tool
//   categoryVisits: { "Design": 5 },
//   searchCount:    14,
//   recentLog:      [ { message, date } ],        // text list shown in "Recent Activity" (max 15)
//   events:         [ { type, date, ... } ],      // full history used for charts + trends (max 500)
// }
// event.type is "view" | "search" | "category" | "visit".
// A "visit" = estimated seconds spent on a tool after clicking "View Tool".

const STORAGE_KEY = "aiverse_activity";
const SAVED_KEY = "aiverse_saved";
const MAX_LOG = 15;
const MAX_EVENTS = 500;
const PENDING_KEY = "aiverse_pending_visit";
const MIN_VISIT_SECONDS = 5; // shorter than this = the user came straight back, ignore
const MAX_VISIT_SECONDS = 30 * 60; // cap, in case a tool tab was left open for hours

function emptyActivity() {
  return { toolClicks: {}, categoryVisits: {}, searchCount: 0, recentLog: [], events: [] };
}

// Old saves have no `events`; rebuild them from recentLog so nothing is lost.
function migrate(activity) {
  if (Array.isArray(activity.events)) return activity;

  activity.events = [...activity.recentLog].reverse().map((entry) => {
    const search = entry.message.match(/^Searched "(.*)"$/);
    const view = entry.message.match(/^Viewed (.+)$/);
    const category = entry.message.match(/^Explored (.+)$/);
    if (search) return { type: "search", query: search[1], date: entry.date };
    if (view) return { type: "view", name: view[1], date: entry.date };
    if (category) return { type: "category", category: category[1], date: entry.date };
    return null;
  }).filter(Boolean);

  return activity;
}

function getActivity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyActivity();
    return migrate({ ...emptyActivity(), ...JSON.parse(raw) });
  } catch {
    return emptyActivity(); // corrupted storage -> start fresh
  }
}

function saveActivity(activity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
}

// Adds one entry to both the history (events) and the visible log (recentLog).
function record(activity, event, message) {
  const date = new Date().toISOString();
  activity.events = [...activity.events, { ...event, date }].slice(-MAX_EVENTS);
  activity.recentLog = [{ message, date }, ...activity.recentLog].slice(0, MAX_LOG);
}

// Call when the user opens/clicks a tool card.
export function logToolClick(tool) {
  const activity = getActivity();
  activity.toolClicks[tool.name] = (activity.toolClicks[tool.name] || 0) + 1;
  activity.categoryVisits[tool.category] = (activity.categoryVisits[tool.category] || 0) + 1;
  record(activity, { type: "view", name: tool.name, category: tool.category }, `Viewed ${tool.name}`);
  saveActivity(activity);
}

// ---------- Time spent on tools ----------
// We cannot see inside another website's tab, so we ESTIMATE the time:
// remember when "View Tool" was clicked, and when the user returns to AI-Verse
// count the time that passed.

function startToolVisit(tool) {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify({ name: tool.name, category: tool.category, startedAt: Date.now() })
  );
}

// Call this whenever the user comes back to AI-Verse. Safe to call many times.
export function finishToolVisit() {
  let pending;
  try {
    pending = JSON.parse(localStorage.getItem(PENDING_KEY));
  } catch {
    pending = null;
  }
  if (!pending) return;
  localStorage.removeItem(PENDING_KEY);

  const seconds = Math.min(Math.round((Date.now() - pending.startedAt) / 1000), MAX_VISIT_SECONDS);
  if (seconds < MIN_VISIT_SECONDS) return;

  const activity = getActivity();
  activity.events = [
    ...activity.events,
    { type: "visit", name: pending.name, category: pending.category, seconds, date: new Date().toISOString() },
  ].slice(-MAX_EVENTS);
  saveActivity(activity);
}

// Use this when a tool link is clicked: logs the view AND starts the timer.
export function logToolOpen(tool) {
  logToolClick(tool);
  startToolVisit(tool);
}

// Call when the user runs a search.
export function logSearch(query) {
  const activity = getActivity();
  activity.searchCount += 1;
  record(activity, { type: "search", query }, `Searched "${query}"`);
  saveActivity(activity);
}

// Call when the user opens a category page/filter.
export function logCategoryVisit(category) {
  const activity = getActivity();
  activity.categoryVisits[category] = (activity.categoryVisits[category] || 0) + 1;
  record(activity, { type: "category", category }, `Explored ${category}`);
  saveActivity(activity);
}

export function getActivityData() {
  return getActivity();
}

// "Clear History": empties only the Recent Activity list. Charts and scores keep their data.
export function clearRecentLog() {
  const activity = getActivity();
  activity.recentLog = [];
  saveActivity(activity);
}

// "Reset data": wipes everything (activity + saved tools).
export function clearActivity() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SAVED_KEY);
}

// ---------- Saved / favourite tools ----------

export function getSavedTools() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch {
    return [];
  }
}

// Adds the tool if it isn't saved, removes it if it is. Returns the new list.
export function toggleSavedTool(toolName) {
  const saved = getSavedTools();
  const next = saved.includes(toolName)
    ? saved.filter((name) => name !== toolName)
    : [...saved, toolName];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}