import './HeroBackground.css';

/*
  HeroBackground is a purely DECORATIVE component.
  It renders no text and handles no clicks — it only draws the
  cinematic atmosphere behind the hero content:

  - layered radial gradients (wine + restrained violet lighting)
  - two slowly drifting "star" layers
  - a faint central orb with orbital rings (the "AI universe" motif)

  Everything is positioned absolute and sits BEHIND the real content,
  so it never blocks clicks (pointer-events: none in the CSS).
*/

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
        <div className="orbit-ring orbit-ring-1" />
        <div className="orbit-ring orbit-ring-2" />
        <div className="orb-core" />
      </div>
    </div>
  );
}

export default HeroBackground;
