import { useEffect, useRef, useState } from 'react';
import './Reveal.css';

/*
  Reveal is a small "wrapper" component.

  You wrap any content inside <Reveal> and it starts invisible,
  then fades in (with a slight upward movement) the first time
  it scrolls into the viewport.

  How it works:
  1. useRef gives us a reference to the real DOM node so we can watch it.
  2. IntersectionObserver is a built-in browser API that tells us when an
     element becomes visible on screen (no scroll-event math needed).
  3. When it becomes visible we flip a useState flag, and CSS does the animation.
*/

function Reveal({ children, delay = 0 }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate only once, then stop watching
        }
      },
      // Fire when 15% of the element has entered the viewport
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`reveal ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default Reveal;
