const Services = () => {
  return (
    <section id="pricing" className="pricing-bento-section">
      <div className="section-container">
        <div className="section-header text-center reveal-text">
          <span className="label mono text-emerald font-semibold">Service Architecture</span>
          <h2 className="serif">Bespoke <i>Solutions</i></h2>
          <p>Transparent scaling structures engineered around verified return on investment.</p>
        </div>
        
        <div className="pricing-bento-grid reveal-text">
          {/* Pricing Card 1: Starter */}
          <div className="pricing-card">
            <div className="card-image-wrapper">
              <img src="/pricing_starter.png" alt="Starter Plan Illustration" className="pricing-card-img" />
              <div className="image-gradient-bottom"></div>
            </div>
            <div className="card-body">
              <div className="card-pricing-title">
                <h3 className="serif">Launch</h3>
                <span className="price serif">₹49,999</span>
              </div>
              <p className="mono text-xs">For local businesses launching online presence</p>
              <ul className="pricing-features mono">
                <li>✦ Bespoke Design System</li>
                <li>✦ Performance Audit (Score 98+)</li>
                <li>✦ Contact Form Integration</li>
                <li>✦ 3 Months Local SLA Support</li>
              </ul>
              
              <a href="#contact" className="interactive-action-btn">
                <span className="btn-label">Get Started</span>
                <div className="icon-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>
            </div>
          </div>
          
          {/* Pricing Card 2: Pro */}
          <div className="pricing-card active-card">
            <div className="card-image-wrapper">
              <img src="/pricing_pro.png" alt="Pro Plan Illustration" className="pricing-card-img" />
              <div className="image-gradient-bottom"></div>
            </div>
            <div className="card-body">
              <div className="card-pricing-title">
                <h3 className="serif text-emerald">Scale</h3>
                <span className="price serif text-emerald">₹1,49,999</span>
              </div>
              <p className="mono text-xs">High performance conversion infrastructure</p>
              <ul className="pricing-features mono">
                <li>✦ Complete Market Analysis</li>
                <li>✦ 5-Page Web Application</li>
                <li>✦ Automated Lead Gen Routing</li>
                <li>✦ Gemini Core Integration</li>
                <li>✦ 6 Months Priority SLA Support</li>
              </ul>
              
              <a href="#contact" className="interactive-action-btn">
                <span className="btn-label">Acquire License</span>
                <div className="icon-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>
            </div>
          </div>
          
          {/* Pricing Card 3: Enterprise */}
          <div className="pricing-card">
            <div className="card-image-wrapper">
              <img src="/pricing_enterprise.png" alt="Enterprise Plan Illustration" className="pricing-card-img" />
              <div className="image-gradient-bottom"></div>
            </div>
            <div className="card-body">
              <div className="card-pricing-title">
                <h3 className="serif">Bespoke</h3>
                <span className="price serif">Custom</span>
              </div>
              <p className="mono text-xs">Dedicated infrastructure for corporations</p>
              <ul className="pricing-features mono">
                <li>✦ Full TAM Scraper Audit</li>
                <li>✦ Custom Application Architecture</li>
                <li>✦ Multi-Database Integrations</li>
                <li>✦ Dedicated Team SLA Support</li>
              </ul>
              
              <a href="#contact" className="interactive-action-btn">
                <span className="btn-label">Initiate Query</span>
                <div className="icon-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
