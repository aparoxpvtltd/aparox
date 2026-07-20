import { useEffect, useRef } from 'react';
import Chat from './Chat';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };
    hero.addEventListener('wheel', handleWheel, { capture: true });

    return () => {
      hero.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-bg-wrapper">
        <img src="/hero_bg.png" alt="Aparox Hero Art" className="hero-bg-img" />
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-bg-text-blur">CREATE</div>

      <div className="hero-grid-container">
        <div className="hero-left-col reveal-text">
          <span className="label mono text-emerald">Organic Intelligence</span>
          <h1 className="serif">Design the <i>Future</i></h1>
          <p className="hero-desc">Aparox AI engineers custom high-performance digital platforms using organic design and modern web technology.</p>
          <div className="hero-chat-container">
            <Chat />
          </div>
        </div>

        <div className="hero-right-col reveal-text">
          <div className="stats-card-stack">
            <div className="glass-stat-card">
              <span className="stat-number serif text-emerald">98%</span>
              <span className="stat-label-small mono">Avg Speed Score</span>
            </div>
            <div className="glass-stat-card">
              <span className="stat-number serif">100%</span>
              <span className="stat-label-small mono">Bespoke Custom Code</span>
            </div>
            <div className="glass-stat-card">
              <span className="stat-number serif text-emerald">2.4x</span>
              <span className="stat-label-small mono">Conversion Boost</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator reveal-text">
        <span className="scroll-title mono">Scroll Down</span>
      </div>
    </section>
  );
};

export default Hero;

