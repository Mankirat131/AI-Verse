import './HeroBackground.css';

/*
  HeroBackground is a purely DECORATIVE component.
  It renders no interactive content — it only draws the
  cinematic atmosphere behind the hero:

  - layered radial gradients (wine + restrained violet lighting)
  - two slowly drifting "star" layers
  - three faint orbital rings with small "node" dots
  - very quiet category labels floating near the edges

  Everything is positioned absolute, sits BEHIND the real content,
  and never blocks clicks (pointer-events: none in the CSS).
*/

// Decorative words placed subtly around the hero edges
const orbitLabels = ['Coding', 'Design', 'Research', 'Video', 'Writing'];

function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      {/* Layer 1: soft color glows */}
      <div className="hero-glow" />

      {/* Layers 2 & 3: star fields drifting at different speeds */}
      <div className="hero-stars hero-stars-far" />
      <div className="hero-stars hero-stars-near" />

      {/* Layer 4: the abstract universe visual */}
      <div className="hero-universe">
        {/* Three orbital paths at increasing sizes */}
        <div className="orbit-ring orbit-ring-1" />
        <div className="orbit-ring orbit-ring-2" />
        <div className="orbit-ring orbit-ring-3" />

        {/* Small "nodes" sitting on/near the orbits */}
        <span className="orbit-node node-1" />
        <span className="orbit-node node-2" />
        <span className="orbit-node node-3" />
        <span className="orbit-node node-4" />
        <span className="orbit-node node-5" />
        <span className="orbit-node node-6" />

        {/* The slightly brighter central light */}
        <div className="orb-core" />
        <span className="orb-center-dot" />
      </div>

      {/* Layer 5: quiet category words near the edges */}
      <div className="hero-labels">
        {orbitLabels.map((label, index) => (
          <span key={label} className={`hero-label label-${index + 1}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Bottom fade so the hero melts into the next section */}
      <div className="hero-fade" />
    </div>
  );
}

export default HeroBackground;
