import { useState } from "react";
import tools from "../data/tools";
import { logSearch, logToolClick } from "../components/util/activityTracker";
import "./Search.css";

const suggestions = [
  "Create an image",
  "Write content",
  "Write or debug code",
  "Research a topic",
  "Create a video",
  "Improve my productivity",
];

const taskKeywords = {
  Coding: ["code", "coding", "program", "programming", "debug", "developer", "website", "app"],
  Design: ["image", "design", "logo", "ui", "visual", "presentation", "poster", "creative"],
  Writing: ["write", "writing", "article", "blog", "essay", "content", "copy", "script"],
  Research: ["research", "paper", "study", "summarize", "summary", "academic", "information"],
  Video: ["video", "edit video", "movie", "reel", "caption", "animation"],
  Productivity: ["productivity", "workflow", "task", "automate", "notes", "organize", "work"],
};

function getMatches(query) {
  const text = query.toLowerCase().trim();

  if (!text) return [];

  const matchedCategories = Object.entries(taskKeywords)
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
    .map(([category]) => category);

  return tools.filter((tool) => {
    const searchableText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();

    return (
      searchableText.includes(text) ||
      matchedCategories.includes(tool.category)
    );
  });
}

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [focused, setFocused] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    const matches = getMatches(cleanQuery);
    setResults(matches);
    setSearched(true);
    setFocused(false);
    logSearch(cleanQuery);
  }

  function handleSuggestion(suggestion) {
    setQuery(suggestion);
    setFocused(false);
  }

  function handleToolClick(tool) {
    logToolClick(tool);
  }

  return (
    <main className={`finder-page ${searched ? "has-results" : ""}`}>
      <section className="finder-hero">
        <div className="finder-copy">
          <p className="finder-eyebrow">AI TOOL FINDER</p>
          <h1>
            Find the right <span>AI tool</span>
            <br />for your work.
          </h1>
          <p className="finder-description">
            Tell us what you want to accomplish and discover tools that fit the task.
          </p>
        </div>

        <form className="finder-search" onSubmit={handleSubmit}>
          <svg
            className="finder-search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="What do you want to accomplish?"
            aria-label="Find an AI tool"
          />

          <button type="submit" aria-label="Search">
            <span>Search</span>
            <span aria-hidden="true">→</span>
          </button>

          {focused && !searched && (
            <div className="finder-suggestions">
              <p>Try a task</p>
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSuggestion(suggestion)}
                >
                  <span>✦</span>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>

        {!searched && (
          <p className="finder-hint">Press Enter to search</p>
        )}
      </section>

      {searched && (
        <section className="finder-results">
          <div className="results-heading">
            <div>
              <p className="results-eyebrow">SEARCH RESULTS</p>
              <h2>
                {results.length > 0
                  ? `${results.length} ${results.length === 1 ? "tool" : "tools"} found`
                  : "No tools found"}
              </h2>
            </div>
            <p className="results-query">“{query.trim()}”</p>
          </div>

          {results.length > 0 ? (
            <div className="tool-results">
              {results.map((tool) => (
                <article className="finder-tool-card" key={tool.id}>
                  <div className="tool-monogram">{tool.monogram}</div>

                  <div className="tool-info">
                    <div className="tool-title-row">
                      <h3>{tool.name}</h3>
                      <span className="tool-rating">★ {tool.rating}</span>
                    </div>
                    <p>{tool.description}</p>
                    <span className="tool-category">{tool.category}</span>
                  </div>

                  <button
                    className="tool-action"
                    type="button"
                    onClick={() => handleToolClick(tool)}
                  >
                    View Tool <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span>⌕</span>
              <h3>We couldn't find a matching tool.</h3>
              <p>Try a task like coding, writing, image creation, research, or video.</p>
              <button type="button" onClick={() => setQuery("")}>Try another search</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Search;
