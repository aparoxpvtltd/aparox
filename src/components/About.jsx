const About = () => (
  <section id="about" className="about-section reveal-text">
    <div className="bg-dot-patch about-bottom-left"></div>
    <div className="about-container">
      <div className="about-visual">
        <canvas id="about-network-canvas"></canvas>
        <div className="blob-gradient"></div>
        <div className="noise-overlay"></div>
      </div>
      <div className="about-content">
        <h2 className="mono tag text-emerald">The Agency</h2>
        <h3 className="serif">Bridging Analytics & <i>Experience</i></h3>
        <p>At Aparox, we believe that beautiful design must be backed by hard data. We don't just build stunning web experiences; we analyze real-world market data to prove your ROI before we write a single line of code. From local brick-and-mortars to global enterprises, we engineer scalable online growth.</p>
        <div className="about-stats-grid">
          <div className="about-stat-card glass-panel">
            <div className="stat-number-wrapper">
              <span className="serif stat-number text-emerald" data-target="98">0</span><span className="serif stat-suffix text-emerald">+</span>
            </div>
            <p class="mono">Avg Lighthouse Score</p>
          </div>
          <div className="about-stat-card glass-panel">
            <div className="stat-number-wrapper">
              <span className="serif stat-number" data-target="100">0</span><span className="serif stat-suffix">%</span>
            </div>
            <p className="mono">Bespoke Custom Code</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
