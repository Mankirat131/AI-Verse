// About.jsx
// Basic structure for the About page — plain JSX, no CSS file yet.

import Navbar from "../components/Navbar";
function About() {
  return (
    <div>
      <Navbar />

      <section>
        <p>ABOUT AI-VERSE</p>
        <h1>AI is everywhere.</h1>
        <h1>Finding the right AI shouldn't be.</h1>
        <p>
          AI-Verse is built to make discovering AI tools simple, useful, and
          less overwhelming.
        </p>
      </section>

      <section>
        <h2>WHY AI-VERSE?</h2>
        <p>
          Thousands of AI tools exist. But finding the right one for a
          specific goal can take hours of searching. AI-Verse brings them
          together in one place.
        </p>
      </section>

      <section>
        <h2>OUR MISSION</h2>
        <p>"Make AI discovery simple."</p>
        <p>Tell us what you want to accomplish.</p>
        <p>Discover the tools that can help.</p>
        <p>Compare your options.</p>
        <p>Choose what works for you.</p>
      </section>

      <section>
        <h2>HOW AI-VERSE WORKS</h2>
        <p>01 Tell us your goal</p>
        <p>02 Discover relevant tools</p>
        <p>03 Compare your options</p>
        <p>04 Find the right AI</p>
      </section>

      <section>
        <h2>WHAT WE'RE BUILDING</h2>
        <p>AI Tool Discovery</p>
        <p>Smart Recommendations</p>
        <p>Tool Comparison</p>
        <p>Category Exploration</p>
      </section>

      <section>
        <h2>OUR VISION</h2>
        <p>A future where you don't need to know</p>
        <p>the name of an AI tool.</p>
        <p>You simply need to know</p>
        <p>what you want to accomplish.</p>
      </section>

      <section>
        <p>AI-VERSE</p>
      </section>
    </div>
  );
}

export default About;