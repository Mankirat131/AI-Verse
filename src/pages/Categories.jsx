import { useState } from "react";
import { ToolProvider, useTools } from "../context/ToolContext";
import "../App.css";

/* ============================================================
  1. DATA
   ============================================================ */

const CATEGORIES = [
  { id: "writing", name: "Writing", popular: true },
  { id: "image", name: "Image Generation", short: "Image", popular: true },
  { id: "video", name: "Video", popular: true },
  { id: "coding", name: "Coding", popular: true },
  { id: "education", name: "Education" },
  { id: "productivity", name: "Productivity" },
  { id: "research", name: "Research", popular: true },
  { id: "marketing", name: "Marketing" },
  { id: "music", name: "Music" },
  { id: "audio", name: "Audio" },
  { id: "design", name: "Design" },
];

const TOOLS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "writing",
    pricing: "Freemium",
    blurb: "Write, brainstorm, research and solve problems with AI.",
    url: "https://chat.openai.com",
  },
  {
    id: "claude",
    name: "Claude",
    category: "writing",
    pricing: "Freemium",
    blurb: "AI assistant for writing, analysis and problem solving.",
    url: "https://claude.ai",
  },
  {
    id: "jasper",
    name: "Jasper",
    category: "writing",
    pricing: "Paid",
    blurb: "AI copywriting tool built for marketing teams and brand voice.",
    url: "https://jasper.ai",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: "writing",
    pricing: "Freemium",
    blurb: "Grammar, tone, and clarity checking as you type.",
    url: "https://grammarly.com",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "image",
    pricing: "Paid",
    blurb: "Create detailed and creative images using AI.",
    url: "https://midjourney.com",
  },
  {
    id: "dalle",
    name: "DALL·E 3",
    category: "image",
    pricing: "Freemium",
    blurb: "Text-to-image model integrated with ChatGPT for quick visuals.",
    url: "https://openai.com/dall-e-3",
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    category: "image",
    pricing: "Freemium",
    blurb: "Fine-tunable image generation aimed at game and product art.",
    url: "https://leonardo.ai",
  },
  {
    id: "runway",
    name: "Runway",
    category: "video",
    pricing: "Freemium",
    blurb: "Create and edit videos using artificial intelligence.",
    url: "https://runwayml.com",
  },
  {
    id: "pika",
    name: "Pika",
    category: "video",
    pricing: "Freemium",
    blurb: "Fast text- and image-to-video generation for short clips.",
    url: "https://pika.art",
  },
  {
    id: "descript",
    name: "Descript",
    category: "video",
    pricing: "Freemium",
    blurb: "Edit video by editing a text transcript; auto captions included.",
    url: "https://descript.com",
  },
  {
    id: "githubcopilot",
    name: "GitHub Copilot",
    category: "coding",
    pricing: "Paid",
    blurb: "AI-powered coding assistance for developers.",
    url: "https://github.com/features/copilot",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    pricing: "Freemium",
    blurb: "AI-native code editor built around chat and multi-file edits.",
    url: "https://cursor.sh",
  },
  {
    id: "claudecode",
    name: "Claude Code",
    category: "coding",
    pricing: "Paid",
    blurb: "Agentic coding tool that works from the terminal or IDE.",
    url: "https://claude.com/product/claude-code",
  },
  {
    id: "khanmigo",
    name: "Khanmigo",
    category: "education",
    pricing: "Paid",
    blurb: "AI tutor from Khan Academy for guided learning.",
    url: "https://khanacademy.org/khan-labs",
  },
  {
    id: "duolingomax",
    name: "Duolingo Max",
    category: "education",
    pricing: "Paid",
    blurb: "Language learning with AI-generated explanations.",
    url: "https://duolingo.com",
  },
  {
    id: "quizlet",
    name: "Quizlet",
    category: "education",
    pricing: "Freemium",
    blurb: "AI-generated flashcards, practice tests, and study guides.",
    url: "https://quizlet.com",
  },
  {
    id: "notionai",
    name: "Notion AI",
    category: "productivity",
    pricing: "Paid",
    blurb: "Writing, summarizing, and Q&A built into Notion docs.",
    url: "https://notion.so/product/ai",
  },
  {
    id: "motion",
    name: "Motion",
    category: "productivity",
    pricing: "Paid",
    blurb: "Automatically schedules tasks and meetings into your calendar.",
    url: "https://usemotion.com",
  },
  {
    id: "superhuman",
    name: "Superhuman",
    category: "productivity",
    pricing: "Paid",
    blurb: "AI-assisted email client focused on inbox management.",
    url: "https://superhuman.com",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "research",
    pricing: "Freemium",
    blurb: "Search and research information with AI-powered answers.",
    url: "https://perplexity.ai",
  },
  {
    id: "elicit",
    name: "Elicit",
    category: "research",
    pricing: "Freemium",
    blurb: "Finds and summarizes academic papers.",
    url: "https://elicit.com",
  },
  {
    id: "consensus",
    name: "Consensus",
    category: "research",
    pricing: "Freemium",
    blurb: "Search engine that answers questions using research studies.",
    url: "https://consensus.app",
  },
  {
    id: "adcreative",
    name: "AdCreative.ai",
    category: "marketing",
    pricing: "Paid",
    blurb: "Generates ad creatives and banners.",
    url: "https://adcreative.ai",
  },
  {
    id: "copyai",
    name: "Copy.ai",
    category: "marketing",
    pricing: "Freemium",
    blurb: "Campaign copy, product descriptions, and social captions.",
    url: "https://copy.ai",
  },
  {
    id: "hubspotai",
    name: "HubSpot AI",
    category: "marketing",
    pricing: "Freemium",
    blurb: "AI assistant built into HubSpot marketing tools.",
    url: "https://hubspot.com",
  },
  {
    id: "suno",
    name: "Suno",
    category: "music",
    pricing: "Freemium",
    blurb: "Generates songs from a text prompt.",
    url: "https://suno.com",
  },
  {
    id: "udio",
    name: "Udio",
    category: "music",
    pricing: "Freemium",
    blurb: "Text-to-music generation with genre and style controls.",
    url: "https://udio.com",
  },
  {
    id: "aiva",
    name: "AIVA",
    category: "music",
    pricing: "Freemium",
    blurb: "Composes instrumental scores for film, games, and ads.",
    url: "https://aiva.ai",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "audio",
    pricing: "Freemium",
    blurb: "Realistic text-to-speech and voice generation.",
    url: "https://elevenlabs.io",
  },
  {
    id: "adobepodcast",
    name: "Adobe Podcast",
    category: "audio",
    pricing: "Freemium",
    blurb: "Cleans up recorded audio, removing noise and echo.",
    url: "https://podcast.adobe.com",
  },
  {
    id: "murf",
    name: "Murf AI",
    category: "audio",
    pricing: "Freemium",
    blurb: "Studio-quality voiceovers for videos and presentations.",
    url: "https://murf.ai",
  },
  {
    id: "figmaai",
    name: "Figma AI",
    category: "design",
    pricing: "Freemium",
    blurb: "AI features for layout and asset generation.",
    url: "https://figma.com",
  },
  {
    id: "canvaai",
    name: "Canva AI",
    category: "design",
    pricing: "Freemium",
    blurb: "AI design assistant for social posts and presentations.",
    url: "https://canva.com/magic-studio",
  },
  {
    id: "galileo",
    name: "Galileo AI",
    category: "design",
    pricing: "Paid",
    blurb: "Generates UI designs from text descriptions.",
    url: "https://usegalileo.ai",
  },
];

/* ============================================================
     2. SMALL COMPONENTS
   ============================================================ */

function CategoryPill({ category, active, onClick }) {
  return (
    <button
      className={active ? "pill active" : "pill"}
      onClick={onClick}
    >
      {category.short || category.name}
    </button>
  );
}

function ToolCard({
  tool,
  categoryName,
  isSaved,
  isComparing,
  onToggleSave,
  onToggleCompare,
}) {
  return (
    <div className="tool-card">
      <div className="tool-card-top">
        <div className="tool-avatar">{tool.name[0]}</div>
        <span className="tool-category-label">{categoryName}</span>
      </div>

      <h3 className="tool-name">{tool.name}</h3>

      <p className="tool-blurb">{tool.blurb}</p>

      <div className="tool-card-bottom">
        <a
          className="tool-link"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View tool →
        </a>

        <div className="tool-actions">
          <button
            className={isComparing ? "icon-button active" : "icon-button"}
            onClick={() => onToggleCompare(tool.id)}
          >
            {isComparing ? "Comparing" : "Compare"}
          </button>

          <button
            className={isSaved ? "icon-button active" : "icon-button"}
            onClick={() => onToggleSave(tool.id)}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareModal({ tools, onClose, onRemove }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Compare tools</h2>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div
            className="compare-grid"
            style={{
              gridTemplateColumns: `repeat(${tools.length}, minmax(0, 1fr))`,
            }}
          >
            {tools.map((tool) => (
              <div key={tool.id} className="compare-card">
                <button
                  className="compare-remove"
                  onClick={() => onRemove(tool.id)}
                >
                  ✕
                </button>

                <h3>{tool.name}</h3>

                <span className="pricing-tag">{tool.pricing}</span>

                <p className="tool-blurb">{tool.blurb}</p>

                <a
                  className="tool-link"
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   3. MAIN CONTENT
   ============================================================ */

function AIToolsDirectoryContent() {
  const [view, setView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  // Context API se shared state
  const {
    savedIds,
    compareIds,
    toggleSave,
    toggleCompare,
    removeFromCompare,
    MAX_COMPARE,
  } = useTools();

  const popularCategories = CATEGORIES.filter(
    (category) => category.popular
  );

  const filteredTools = TOOLS.filter(
    (tool) =>
      !selectedCategory || tool.category === selectedCategory
  );

  const savedTools = TOOLS.filter((tool) =>
    savedIds.includes(tool.id)
  );

  const compareTools = TOOLS.filter((tool) =>
    compareIds.includes(tool.id)
  );

  const gridTools = view === "saved" ? savedTools : filteredTools;

  function getCategoryName(id) {
    return CATEGORIES.find((category) => category.id === id)?.name || id;
  }

  function togglePill(id) {
    setSelectedCategory((previous) =>
      previous === id ? null : id
    );
  }

  function goHome() {
    setView("home");
    setSelectedCategory(null);
  }

  function handleRemoveFromCompare(id) {
    removeFromCompare(id);

    if (compareIds.length <= 1) {
      setShowCompare(false);
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <button className="logo-button" onClick={goHome}>
            <span className="logo-icon">★</span>
            <span className="logo-text">AI Tool Directory</span>
          </button>

          <button
            className={view === "saved" ? "saved-button active" : "saved-button"}
            onClick={() => setView("saved")}
          >
            Saved ({savedIds.length})
          </button>
        </div>
      </header>

      <main className="main">
        <div key={view} className="view-transition">
          {/* Hero */}
          {view === "home" && (
            <div className="hero">
              <p className="hero-eyebrow">AI Tool Discovery</p>

              <h1 className="hero-title">
                Browse by <span>category</span>
              </h1>

              <p className="hero-subtitle">
                Pick a category to see the tools inside it.
              </p>

              <div className="pill-row">
                <span className="pill-label">Popular:</span>

                {popularCategories.map((category) => (
                  <CategoryPill
                    key={category.id}
                    category={category}
                    active={selectedCategory === category.id}
                    onClick={() => togglePill(category.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section heading and category dropdown */}
          <div className="section-header">
            <div>
              <p className="section-eyebrow">
                {view === "saved" ? "Your list" : "Discover"}
              </p>

              <h2 className="section-title">
                {view === "saved" ? "Saved tools" : "Explore AI tools"}
              </h2>
            </div>

            {view === "home" && (
              <select
                className="category-select"
                value={selectedCategory || ""}
                onChange={(event) =>
                  setSelectedCategory(event.target.value || null)
                }
              >
                <option value="">All categories</option>

                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tool cards */}
          {gridTools.length === 0 ? (
            <p className="empty-message">
              {view === "saved"
                ? "You haven't saved any tools yet."
                : "No tools in this category yet."}
            </p>
          ) : (
            <div className="tool-grid">
              {gridTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  categoryName={getCategoryName(tool.category)}
                  isSaved={savedIds.includes(tool.id)}
                  isComparing={compareIds.includes(tool.id)}
                  onToggleSave={toggleSave}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating comparison button */}
      {compareIds.length > 0 && (
        <div className="compare-tray">
          <button
            className="compare-tray-button"
            onClick={() => setShowCompare(true)}
          >
            Compare {compareIds.length}/{MAX_COMPARE}
          </button>
        </div>
      )}

      {/* Comparison modal */}
      {showCompare && compareTools.length > 0 && (
        <CompareModal
          tools={compareTools}
          onClose={() => setShowCompare(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}
    </div>
  );
}

/* ============================================================
    4. EXPORT WITH CONTEXT PROVIDER
   ============================================================ */

export default function AIToolsDirectory() {
  return (
    <ToolProvider>
      <AIToolsDirectoryContent />
    </ToolProvider>
  );
}