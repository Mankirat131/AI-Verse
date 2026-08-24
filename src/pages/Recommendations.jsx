import { useState } from "react";


function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const tools = [
    {
      id: 1,
      name: "ChatGPT",
      category: "Writing",
      description: "Write, brainstorm, research and solve problems with AI.",
    },
    {
      id: 2,
      name: "Claude",
      category: "Writing",
      description: "An AI assistant for writing, analysis and problem solving.",
    },
    {
      id: 3,
      name: "Midjourney",
      category: "Design",
      description: "Create detailed and creative images using AI.",
    },
    {
      id: 4,
      name: "Runway",
      category: "Video",
      description: "Create and edit videos using artificial intelligence.",
    },
    {
      id: 5,
      name: "Perplexity",
      category: "Research",
      description: "Research topics and find information using AI.",
    },
    {
      id: 6,
      name: "GitHub Copilot",
      category: "Coding",
      description: "AI-powered coding assistance for developers.",
    },
  ];

  const categories = [
    "All",
    "Writing",
    "Design",
    "Coding",
    "Video",
    "Research",
  ];

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <main className="recommendations-page">

      {/* Hero */}
      <section className="recommendations-hero">

        <p className="recommendations-label">
          AI TOOL DISCOVERY
        </p>

        <h1>
          Tools worth
          <span> knowing.</span>
        </h1>

        <p className="recommendations-description">
          Explore AI tools selected to help you create,
          build, write, research and get more done.
        </p>

      </section>


      {/* Category Selector */}
      <section className="recommendation-filter">

        <p>EXPLORE BY CATEGORY</p>

        <div className="category-buttons">

          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

        </div>

      </section>


      {/* Recommended Tools */}
      <section className="recommended-tools">

        <div className="recommendation-heading">

          <div>
            <p>RECOMMENDED</p>

            <h2>
              {selectedCategory === "All"
                ? "Explore these tools"
                : `Best tools for ${selectedCategory}`}
            </h2>
          </div>

          <span>
            {filteredTools.length} tools
          </span>

        </div>


        <div className="recommendation-grid">

          {filteredTools.map((tool) => (

            <article
              className="recommendation-card"
              key={tool.id}
            >

              <div className="recommendation-card-top">

                <div className="recommendation-icon">
                  {tool.name.charAt(0)}
                </div>

                <span>
                  {tool.category}
                </span>

              </div>

              <h3>{tool.name}</h3>

              <p>{tool.description}</p>

              <button className="recommendation-link">
                Explore tool →
              </button>

            </article>

          ))}

        </div>

      </section>


      {/* Goal Section */}
      <section className="goal-section">

        <p>NOT SURE WHERE TO START?</p>

        <h2>
          Start with what
          <span> you want to do.</span>
        </h2>

        <p>
          Tell AI-Verse your goal and discover tools
          that can help you accomplish it.
        </p>

        <button className="goal-button">
          Find a tool →
        </button>

      </section>

    </main>
  );
}

export default Recommendations;