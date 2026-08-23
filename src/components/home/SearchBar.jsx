import { useState } from 'react';
import './SearchBar.css';

// Suggested quick-search tags shown under the input
const suggestedTags = ['Coding', 'Design', 'Writing', 'Research', 'Video', 'Productivity', 'Marketing'];

/*
  SearchBar — the main hero interaction.

  Uses one piece of state: the current text typed by the user.
  Submitting the form or clicking a tag just logs to the console
  for now (real search comes later).
*/

function SearchBar() {
  const [query, setQuery] = useState('');

  // Runs when the user presses Enter or clicks the search button
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    console.log('Searching for:', query);
  }

  // Runs when a suggestion tag is clicked
  function handleTagClick(tag) {
    setQuery(tag); // put the tag into the input so the user sees it
    console.log('Tag selected:', tag);
  }

  return (
    <div className="search-area">
      <form className="search-bar" onSubmit={handleSubmit}>
        {/* Magnifying glass icon inside the input */}
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <input
          type="text"
          className="search-input"
          placeholder="What's your goal today?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search AI tools"
        />

        <button type="submit" className="search-submit">
          Search
        </button>
      </form>

      <div className="search-tags">
        <span className="search-tags-label">Popular:</span>
        {suggestedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="search-tag"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
