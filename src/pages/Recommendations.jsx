// src/pages/Recommendations.jsx
//
// Personalized "AI Universe" dashboard.
// Uses only useState + useEffect + localStorage, per your current React level.
// Reads activity logged by src/utils/activityTracker.js and turns it into
// a profile, an activity chart, top tools, recommendations, and a workflow.

import { useState, useEffect } from "react";
import tools from "../data/tools";
import { getActivityData } from "../components/util/activityTracker";


// Suggested tool pipeline per category. Adjust names to match your tools.js
const workflowMap = {
  Writing: ["Perplexity", "ChatGPT", "Claude"],
  Coding: ["ChatGPT", "GitHub Copilot", "Claude"],
  Design: ["Midjourney", "ChatGPT"],
  Video: ["Runway", "ChatGPT"],
  Research: ["Perplexity", "Claude", "ChatGPT"],
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Recommendations() {
  const [activity, setActivity] = useState(null);

  // Load activity data once, when the page first renders
  useEffect(() => {
    const data = getActivityData();
    setActivity(data);
  }, []);

  // First render, before useEffect has run yet
  if (!activity) {
    return (
      <div className="rec-page">
        <p className="rec-loading">Loading your activity...</p>
      </div>
    );
  }

  const hasActivity =
    Object.keys(activity.toolClicks).length > 0 ||
    Object.keys(activity.categoryVisits).length > 0 ||
    activity.searchCount > 0;

  // ---------- Empty state: brand new visitor, nothing tracked yet ----------
  if (!hasActivity) {
    return (
      <div className="rec-page">
        <div className="rec-empty">
          <span className="rec-empty-icon">&#9671;</span>
          <h1>Your AI Universe is empty — for now</h1>
          <p>
            Explore a few tools, run a search, or browse a category. Come
            back here and AI-Verse will start building your personal
            recommendations.
          </p>
          <a href="/search" className="rec-cta">
            Start exploring →
          </a>
        </div>
      </div>
    );
  }

  // ---------- Derived stats (plain JS, no extra state needed) ----------

  const totalViews = Object.values(activity.toolClicks).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalCategoryVisits = Object.values(activity.categoryVisits).reduce(
    (sum, count) => sum + count,
    0
  );

  const categoriesExplored = Object.keys(activity.categoryVisits).length;

  // Category breakdown, highest first
  const categoryBreakdown = Object.entries(activity.categoryVisits)
    .map(([category, count]) => ({
      category,
      count,
      percent: Math.round((count / totalCategoryVisits) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : null;

  // Top tools, highest first
  const topTools = Object.entries(activity.toolClicks)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Activity grouped by day of week, from the recent log
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  activity.recentLog.forEach((entry) => {
    const day = new Date(entry.date).getDay();
    dayCounts[day] += 1;
  });
  const maxDayCount = Math.max(...dayCounts, 1);

  // Recommended tools: unvisited tools from the top category
  const recommended = tools.filter(
    (tool) => tool.category === topCategory && !activity.toolClicks[tool.name]
  );

  // Fallback if everything in the top category has already been viewed
  const suggestedTools =
    recommended.length > 0
      ? recommended.slice(0, 3)
      : tools.filter((tool) => tool.category !== topCategory).slice(0, 3);

  const workflow = workflowMap[topCategory] || [];

  return (
    <div className="rec-page">
      {/* Banner */}
      <div className="rec-banner">
        <p className="rec-eyebrow">Your AI Universe</p>
        <h1>AI-Verse is learning how you work.</h1>
        <div className="rec-stats">
          <div className="rec-stat">
            <span className="rec-stat-num">{totalViews}</span>
            <span className="rec-stat-label">tools viewed</span>
          </div>
          <div className="rec-stat">
            <span className="rec-stat-num">{activity.searchCount}</span>
            <span className="rec-stat-label">searches</span>
          </div>
          <div className="rec-stat">
            <span className="rec-stat-num">{categoriesExplored}</span>
            <span className="rec-stat-label">categories</span>
          </div>
        </div>
      </div>

      {/* Profile bars */}
      <section className="rec-section">
        <h2>Your AI Profile</h2>
        <div className="rec-profile">
          {categoryBreakdown.map((item, index) => (
            <div className="rec-bar-row" key={item.category}>
              <span className="rec-bar-label">{item.category}</span>
              <div className="rec-bar-track">
                <div
                  className={"rec-bar-fill" + (index === 0 ? " is-top" : "")}
                  style={{ width: item.percent + "%" }}
                ></div>
              </div>
              <span className="rec-bar-percent">{item.percent}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Activity chart + top tools, side by side */}
      <section className="rec-section rec-split">
        <div>
          <h2>Your Activity</h2>
          <div className="rec-chart">
            {dayCounts.map((count, index) => (
              <div className="rec-chart-col" key={DAY_LABELS[index]}>
                <div
                  className="rec-chart-bar"
                  style={{ height: (count / maxDayCount) * 100 + "%" }}
                ></div>
                <span className="rec-chart-label">{DAY_LABELS[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>Top Tools</h2>
          <ol className="rec-top-tools">
            {topTools.map((tool, index) => (
              <li key={tool.name}>
                <span className="rec-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rec-tool-name">{tool.name}</span>
                <span className="rec-tool-count">{tool.count}×</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Recommended tools */}
      <section className="rec-section">
        <h2>Recommended For Your Workflow</h2>
        <div className="rec-tool-grid">
          {suggestedTools.map((tool) => (
            <div className="rec-tool-card" key={tool.id}>
              <div className="rec-tool-tag">{tool.category}</div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <span className="rec-tool-reason">
                Because you explore {tool.category.toLowerCase()} often
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested workflow */}
      {workflow.length > 0 && (
        <section className="rec-section">
          <h2>Your Suggested Workflow</h2>
          <div className="rec-workflow">
            {workflow.map((step, index) => (
              <div className="rec-workflow-step" key={step}>
                <span>{step}</span>
                {index < workflow.length - 1 && (
                  <span className="rec-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent activity log */}
      <section className="rec-section">
        <h2>Recent Activity</h2>
        <ul className="rec-log">
          {activity.recentLog.slice(0, 8).map((entry, index) => (
            <li key={index}>
              <span className="rec-log-dot"></span>
              <span className="rec-log-text">{entry.message}</span>
              <span className="rec-log-time">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Recommendations;