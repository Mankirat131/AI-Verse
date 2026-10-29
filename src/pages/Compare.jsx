import { useSelector, useDispatch } from "react-redux";

import {
  saveComparison,
  removeComparison,
} from "../features/compare/compareSlice";
import React, { useState } from "react";

const aiTools = [
  {
    id: 1,
    name: "ChatGPT",
    type: "Free / Paid",
    rating: 4.5,
    mainUse: "General chatting, writing, coding help, brainstorming",
    extra: "Useful for a wide range of everyday tasks.",
  },
  {
    id: 2,
    name: "Claude",
    type: "Free / Paid",
    rating: 4.6,
    mainUse: "Long document analysis, coding, and writing",
    extra: "Useful for working with lengthy documents.",
  },
  {
    id: 3,
    name: "Gemini",
    type: "Free / Paid",
    rating: 4.3,
    mainUse: "Research, coding, and image tasks",
    extra: "Integrates with supported Google services.",
  },
  {
    id: 4,
    name: "GitHub Copilot",
    type: "Free / Paid plans",
    rating: 4.4,
    mainUse: "Code autocomplete and code generation",
    extra: "Works with supported code editors.",
  },
  {
    id: 5,
    name: "Midjourney",
    type: "Paid",
    rating: 4.7,
    mainUse: "AI image generation and digital art",
    extra: "Creates images from text prompts.",
  },
];

// Reusable ToolCard component
function ToolCard({ tool }) {
  if (!tool) {
    return (
      <article className="tool-card empty">
        <h2>Select an AI Tool</h2>
        <p>Select a tool above to view its details.</p>
      </article>
    );
  }

  return (
    <article className="tool-card">
      <h2>{tool.name}</h2>

      <p>
        <strong>Category:</strong> {tool.name === "Midjourney"
          ? "Image Generation"
          : tool.name === "GitHub Copilot"
          ? "Coding"
          : "AI Assistant"}
      </p>

      <p>
        <strong>Pricing:</strong> {tool.type}
      </p>

      <p>
        <strong>Rating:</strong> ⭐ {tool.rating} / 5
      </p>

      <p>
        <strong>Mainly used for:</strong> {tool.mainUse}
      </p>

      <p>
        <strong>Features:</strong> {tool.extra}
      </p>
    </article>
  );
}

// Main Compare component
function Compare() {
  const [tool1Id, setTool1Id] = useState("");
  const [tool2Id, setTool2Id] = useState("");

  // State for saved comparisons
  const dispatch = useDispatch();

const savedComparisons = useSelector(
  (state) => state.compare.savedComparisons
);

  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // State for the suggestion form
  const [suggestion, setSuggestion] = useState("");
  

  const tool1 = aiTools.find(
    (tool) => tool.id === Number(tool1Id)
  );

  const tool2 = aiTools.find(
    (tool) => tool.id === Number(tool2Id)
  );

  // Handle comparison
  function handleCompare() {
    setError("");
    setMessage("");

    if (!tool1 || !tool2) {
      setError("Please select both AI tools.");
      return;
    }

    if (tool1.id === tool2.id) {
      setError("Please select two different AI tools.");
      return;
    }

    setLoading(true);

    // Simulate an asynchronous operation
    setTimeout(() => {
      setLoading(false);
      setMessage(
        `${tool1.name} and ${tool2.name} are ready to compare!`
      );
    }, 500);
  }

  // Save comparison
function handleSaveComparison() {
  if (!tool1 || !tool2) {
    setError("Please select both tools before saving.");
    return;
  }

  if (tool1.id === tool2.id) {
    setError("Please select two different tools.");
    return;
  }

  const alreadySaved = savedComparisons.some(
    (item) =>
      (item.tool1Id === tool1.id &&
        item.tool2Id === tool2.id) ||
      (item.tool1Id === tool2.id &&
        item.tool2Id === tool1.id)
  );

  if (alreadySaved) {
    setMessage("This comparison is already saved.");
    setError("");
    return;
  }

  const newComparison = {
    id: Date.now(),
    tool1Id: tool1.id,
    tool2Id: tool2.id,
    tool1Name: tool1.name,
    tool2Name: tool2.name,
  };

  dispatch(saveComparison(newComparison));

  setMessage("Comparison saved successfully!");
  setError("");
}

  // Remove a saved comparison
  function handleRemoveComparison(id) {
  dispatch(removeComparison(id));

  setMessage("Saved comparison removed.");
  setError("");
}

  // Handle suggestion form
  function handleSuggestionSubmit(event) {
    event.preventDefault();

    const trimmedSuggestion = suggestion.trim();

    if (!trimmedSuggestion) {
      setError("Please enter an AI tool name.");
      setMessage("");
      return;
    }

    setError("");
    setMessage(
      `Thank you! Your suggestion "${trimmedSuggestion}" has been received for this session.`
    );

    setSuggestion("");
  }

  return (
    <main className="compare-container">

      {/* Header */}
      <header className="compare-header">
        <h1>Compare AI Tools</h1>

        <p className="subtitle">
          Select two AI tools to compare their features,
          pricing, and ratings.
        </p>
      </header>

      {/* Tool Selectors */}
      <section className="selectors-section">
        <div className="selector-item">
          <label htmlFor="tool1-select">
            First AI Tool
          </label>

          <select
            id="tool1-select"
            value={tool1Id}
            onChange={(event) => {
              setTool1Id(event.target.value);
              setError("");
              setMessage("");
            }}
          >
            <option value="">-- Select Tool 1 --</option>

            {aiTools.map((tool) => (
              <option
                key={tool.id}
                value={tool.id}
                disabled={String(tool.id) === tool2Id}
              >
                {tool.name}
              </option>
            ))}
          </select>
        </div>

        <span className="vs">VS</span>

        <div className="selector-item">
          <label htmlFor="tool2-select">
            Second AI Tool
          </label>

          <select
            id="tool2-select"
            value={tool2Id}
            onChange={(event) => {
              setTool2Id(event.target.value);
              setError("");
              setMessage("");
            }}
          >
            <option value="">-- Select Tool 2 --</option>

            {aiTools.map((tool) => (
              <option
                key={tool.id}
                value={tool.id}
                disabled={String(tool.id) === tool1Id}
              >
                {tool.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button type="button" onClick={handleCompare}>
          Compare Tools
        </button>

        <button
          type="button"
          onClick={handleSaveComparison}
        >
          Save Comparison
        </button>
      </div>

      {/* Loading, Error, and Success Messages */}
      {loading && (
        <p role="status">Loading comparison...</p>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}

      {/* Comparison Cards */}
      <section className="cards-wrapper">
        <ToolCard tool={tool1} />
        <ToolCard tool={tool2} />
      </section>

      {/* Saved Comparisons */}
      <section className="saved-section">
        <h2>Saved Comparisons</h2>

        {savedComparisons.length === 0 ? (
          <p>No saved comparisons yet.</p>
        ) : (
          savedComparisons.map((item) => (
            <article className="saved-item" key={item.id}>
              <p>
                {item.tool1Name} VS {item.tool2Name}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleRemoveComparison(item.id)
                }
              >
                Remove
              </button>
            </article>
          ))
        )}
      </section>

      {/* Suggest an AI Tool Form */}
      <section className="suggestion-section">
        <h2>Suggest an AI Tool</h2>

        <p>
          Know an AI tool that should be added to our list?
          Suggest it below.
        </p>

        <form onSubmit={handleSuggestionSubmit}>
          <label htmlFor="suggestion">
            AI Tool Name
          </label>

          <input
            id="suggestion"
            type="text"
            value={suggestion}
            onChange={(event) =>
              setSuggestion(event.target.value)
            }
            placeholder="Enter AI tool name"
            required
          />

          <button type="submit">
            Submit Suggestion
          </button>
        </form>
      </section>

    </main>
  );
}

export default Compare;