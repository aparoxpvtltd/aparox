const Features = () => (
  <section id="features" className="feature-grid-section">
    <div className="section-container">
      <div className="feature-two-col">
        {/* Left Column: Sticky Header & Grid */}
        <div className="feature-left-col">
          <div className="sticky-feature-header reveal-text">
            <span className="label mono text-emerald font-semibold">Methodology</span>
            <h2 className="serif">Engineered for <i>Growth</i></h2>
            <p>We deploy advanced digital frameworks designed to optimize conversions and accelerate loading speeds.</p>
          </div>
          
          <div className="feature-mini-grid reveal-text">
            <div className="feature-mini-card">
              <div className="mini-icon text-emerald">✦</div>
              <span className="mini-label mono">Market Intelligence</span>
            </div>
            <div className="feature-mini-card">
              <div className="mini-icon">✦</div>
              <span className="mini-label mono">Bespoke Dev</span>
            </div>
            <div className="feature-mini-card">
              <div className="mini-icon">✦</div>
              <span className="mini-label mono">UI/UX Flow</span>
            </div>
            <div className="feature-mini-card">
              <div className="mini-icon text-emerald">✦</div>
              <span className="mini-label mono">SEO Framework</span>
            </div>
            <div className="feature-mini-card">
              <div className="mini-icon">✦</div>
              <span className="mini-label mono">E-commerce Backend</span>
            </div>
            <div className="feature-mini-card">
              <div className="mini-icon text-emerald">✦</div>
              <span className="mini-label mono">Analytics Dashboard</span>
            </div>
          </div>
        </div>
        
        {/* Right Column: Display Card & System Widget */}
        <div className="feature-right-col reveal-text">
          <div className="dashboard-display-card">
            <div className="image-zoom-container">
              <img src="/feature_dashboard.png" alt="Aparox System Dashboard" class="display-image" />
            </div>
            
            {/* Floating Glass System Analysis Widget */}
            <div className="glass-system-widget glass-panel">
              <div className="widget-header">
                <div className="status-dot"></div>
                <span className="mono text-xs">System Analysis</span>
              </div>
              <div className="progress-stack">
                <div className="progress-item">
                  <div className="progress-labels mono">
                    <span>Speed Index</span>
                    <span className="text-emerald">99%</span>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill emerald-fill" style={{ width: '99%' }}></div></div>
                </div>
                <div className="progress-item">
                  <div className="progress-labels mono">
                    <span>SEO Optimization</span>
                    <span>100%</span>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '100%' }}></div></div>
                </div>
                <div className="progress-item">
                  <div className="progress-labels mono">
                    <span>Fluid Performance</span>
                    <span className="text-emerald">98%</span>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill emerald-fill" style={{ width: '98%' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
