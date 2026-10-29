import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import tools, { getToolLink } from "../data/tools";
import {
  getActivityData,
  getSavedTools,
  toggleSavedTool,
  clearRecentLog,
  clearActivity,
  logToolOpen,
  finishToolVisit,
} from "../components/util/activityTracker";
import { getRecommendations, isUsefulLogEntry, formatDuration } from "../components/util/recommendationEngine";
import "./Recommendations.css";

const SLICE_COLORS = ["#c9765a", "#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#6b7280"];

// One reusable bar (used by "Your AI Profile" and "Time Distribution")
function BarRow({ label, percent, color, animate }) {
  return (
    <div className="rec-bar">
      <div className="rec-bar-top">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="rec-bar-track">
        <div
          className="rec-bar-fill"
          style={{ width: animate ? `${percent}%` : "0%", backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// Donut ("wheel") chart: one arc per tool, sized by time spent
function Donut({ items, totalSeconds, animate }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="rec-donut-wrap">
      <svg className="rec-donut" viewBox="0 0 120 120" role="img" aria-label="Time spent per tool">
        <circle className="rec-donut-ring" cx="60" cy="60" r={radius} />
        {items.map((item, i) => {
          const length = (item.seconds / totalSeconds) * circumference;
          const circle = (
            <circle
              key={item.name}
              className="rec-donut-slice"
              cx="60"
              cy="60"
              r={radius}
              stroke={SLICE_COLORS[i % SLICE_COLORS.length]}
              strokeDasharray={`${animate ? length : 0} ${circumference}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return circle;
        })}
        <text className="rec-donut-total" x="60" y="58" textAnchor="middle">{formatDuration(totalSeconds)}</text>
        <text className="rec-donut-sub" x="60" y="74" textAnchor="middle">total</text>
      </svg>

      <ul className="rec-donut-legend">
        {items.map((item, i) => (
          <li key={item.name}>
            <span className="rec-donut-dot" style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }} />
            <span className="rec-donut-name">{item.name}</span>
            <span className="rec-donut-value">{item.percent}% · {formatDuration(item.seconds)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// One reusable KPI card
function KpiCard({ icon, label, value, badge, isUp }) {
  return (
    <div className="rec-kpi-card">
      <div className="rec-kpi-top">
        <div className="rec-kpi-icon">{icon}</div>
        <span className={`rec-kpi-badge ${isUp ? "is-up" : "is-down"}`}>{badge}</span>
      </div>
      <span className="rec-kpi-label">{label}</span>
      <strong className="rec-kpi-value">{value}</strong>
    </div>
  );
}

const trend = (diff) => `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff)}`;

function Recommendations() {
  const [activity, setActivity] = useState(getActivityData);
  const [savedTools, setSavedTools] = useState(getSavedTools);
  const [rangeDays, setRangeDays] = useState(7);
  const [animate, setAnimate] = useState(false);

  // If you land here right after visiting a tool, record that visit first
  useEffect(() => {
    finishToolVisit();
    setActivity(getActivityData());
  }, []);

  // Bars start at 0 and grow once the page has mounted
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Coming back from a tool's tab: pick up the view that was just logged
  useEffect(() => {
    const onFocus = () => {
      finishToolVisit(); // adds the time spent on the tool you just visited
      setActivity(getActivityData());
      setSavedTools(getSavedTools());
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const data = useMemo(
    () => getRecommendations({ activity, tools, savedTools, rangeDays }),
    [activity, savedTools, rangeDays]
  );

  function reload() {
    setActivity(getActivityData());
    setSavedTools(getSavedTools());
  }

  function handleClearHistory() {
    clearRecentLog();
    reload();
  }

  function handleReset() {
    if (!window.confirm("Reset all your activity and saved tools?")) return;
    clearActivity();
    reload();
  }

  const hasActivity =
    activity.events.length > 0 || Object.keys(activity.toolClicks).length > 0 || savedTools.length > 0;

  if (!hasActivity) {
    return (
      <div className="rec-page">
        <div className="rec-empty">
          <span className="rec-empty-icon">◇</span>
          <h1>Your AI Universe is empty for now</h1>
          <p>
            Explore a few tools, run a search, or browse a category. Come back here and
            AI-Verse will start building your personal recommendations.
          </p>
          <Link to="/search" className="rec-cta">Start exploring →</Link>
        </div>
      </div>
    );
  }

  const maxDay = Math.max(...data.weekly.map((d) => d.count), 1);
  const recentLog = activity.recentLog.filter((entry) => isUsefulLogEntry(entry.message)).slice(0, 8);

  return (
    <div className="rec-page">
      {/* Header + controls */}
      <div className="rec-header">
        <div>
          <p className="rec-eyebrow">Your AI universe</p>
          <h1 className="rec-title">Welcome back, Explorer</h1>
        </div>
        <div className="rec-controls">
          <select
            className="rec-control"
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            aria-label="Date range"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button className="rec-control" onClick={reload}>↻ Refresh</button>
          <button className="rec-control" onClick={handleReset}>Reset data</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="rec-kpi-grid">
        <KpiCard
          icon="👁"
          label="Tools viewed"
          value={data.views}
          badge={trend(data.views - data.prevViews)}
          isUp={data.views >= data.prevViews}
        />
        <KpiCard
          icon="🔍"
          label="Searches"
          value={data.searches}
          badge={trend(data.searches - data.prevSearches)}
          isUp={data.searches >= data.prevSearches}
        />
        <KpiCard
          icon="⚡"
          label="Top category"
          value={data.topCategory}
          badge={`${data.topPercent}%`}
          isUp
        />
        <KpiCard
          icon="🎯"
          label="Profile match score"
          value={`${data.confidence}%`}
          badge={data.confidence >= 50 ? "↑ High" : "↓ Low"}
          isUp={data.confidence >= 50}
        />
      </div>

      {/* AI profile */}
      <section className="rec-section">
        <h2 className="rec-heading">Your AI profile</h2>
        <div className="rec-profile">
          {data.profile.map((item, index) => (
            <BarRow
              key={item.category}
              label={item.category}
              percent={item.percent}
              color={index === 0 && item.percent > 0 ? "var(--rec-accent)" : "var(--rec-text-muted)"}
              animate={animate}
            />
          ))}
        </div>
      </section>

      {/* Weekly activity + Time distribution */}
      <section className="rec-section rec-split">
        <div className="rec-panel">
          <h3 className="rec-panel-title">Your activity · last 7 days</h3>
          <div className="rec-chart">
            {data.weekly.map((day, i) => (
              <div className="rec-chart-col" key={i}>
                <div className="rec-chart-track">
                  <div
                    className="rec-chart-bar"
                    data-count={day.count}
                    title={`${day.label}: ${day.count} ${day.count === 1 ? "action" : "actions"}`}
                    style={{ height: animate ? `${(day.count / maxDay) * 100}%` : "0%" }}
                  />
                </div>
                <span className="rec-chart-label">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rec-panel">
          <div className="rec-panel-head">
            <h3 className="rec-panel-title">Time on tools</h3>
            <span
              className="rec-info"
              title="Estimated: the time between clicking View Tool and coming back to AI-Verse."
            >
              ⓘ
            </span>
          </div>

          {data.toolTime.totalSeconds === 0 ? (
            <p className="rec-muted-note">
              Open a tool with "View Tool" and come back. We will estimate how long you spent there.
            </p>
          ) : (
            <Donut items={data.toolTime.items} totalSeconds={data.toolTime.totalSeconds} animate={animate} />
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section className="rec-section">
        <div className="rec-section-head">
          <h2 className="rec-heading">Recommended for your workflow</h2>
          {data.isFallback && (
            <span className="rec-fallback-note">
              Explore a few more tools to unlock personalised recommendations.
            </span>
          )}
        </div>

        {data.recommendations.length === 0 ? (
          <p className="rec-muted-note">You have already explored every tool we have. Check back soon.</p>
        ) : (
          <div className="rec-tool-grid">
            {data.recommendations.map((tool) => {
              const isSaved = savedTools.includes(tool.name);
              return (
                <div className="rec-tool-card" key={tool.id || tool.name}>
                  <div className="rec-card-top">
                    <span className="rec-tool-tag">{tool.category}</span>
                    <div className="rec-card-actions">
                      {tool.matchScore !== null && (
                        <span className="rec-match-badge">{tool.matchScore}% match</span>
                      )}
                      <button
                        className={`rec-save-btn ${isSaved ? "is-saved" : ""}`}
                        onClick={() => setSavedTools(toggleSavedTool(tool.name))}
                        aria-label={isSaved ? `Unsave ${tool.name}` : `Save ${tool.name}`}
                        aria-pressed={isSaved}
                      >
                        {isSaved ? "♥" : "♡"}
                      </button>
                    </div>
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <span className="rec-tool-reason">{tool.reason}</span>
                  <a
                    className="rec-visit"
                    href={getToolLink(tool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logToolOpen(tool)}
                  >
                    Visit tool →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Top tools */}
      <section className="rec-section">
        <h2 className="rec-heading">Top tools</h2>
        {data.topTools.length === 0 ? (
          <p className="rec-muted-note">No tools viewed yet.</p>
        ) : (
          <ol className="rec-list">
            {data.topTools.map((tool, index) => (
              <li key={tool.name}>
                <span className="rec-rank">{String(index + 1).padStart(2, "0")}</span>
                <span className="rec-list-text">{tool.name}</span>
                <span className="rec-list-meta">{tool.count}×</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Recent activity */}
      <section className="rec-section">
        <div className="rec-section-head">
          <h2 className="rec-heading">Recent activity</h2>
          <button className="rec-link-btn" onClick={handleClearHistory}>Clear history</button>
        </div>
        {recentLog.length === 0 ? (
          <p className="rec-muted-note">No recent activity.</p>
        ) : (
          <ul className="rec-list">
            {recentLog.map((entry, index) => (
              <li key={index}>
                <span className="rec-dot" />
                <span className="rec-list-text">{entry.message}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Recommendations;