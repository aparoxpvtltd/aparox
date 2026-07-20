import { useState } from 'react';

const Analytics = () => {
  const [bizName, setBizName] = useState('');
  const [bizLocation, setBizLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bizName || !bizLocation) return;

    setLoading(true);
    setResults(null);

    // Mock Scraper Delay
    setTimeout(() => {
      const mockTAM = Math.floor(Math.random() * (50000000 - 5000000 + 1)) + 5000000; // ₹50 Lakh to ₹5 Crore
      const mockCustomers = Math.floor(Math.random() * (10000 - 500 + 1)) + 500;
      const mockProfit = Math.floor(Math.random() * (2500000 - 200000 + 1)) + 200000;

      setResults({
        name: bizName,
        location: bizLocation,
        tam: mockTAM,
        customers: mockCustomers,
        profit: mockProfit
      });
      setLoading(false);
    }, 2500);
  };

  const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

  return (
    <section id="productivity" className="productivity-section">
      <div className="productivity-container">
        <div className="productivity-two-col">
          {/* Left Column: Steps */}
          <div className="productivity-left-col reveal-text">
            <span className="label mono text-emerald">Instant Audit</span>
            <h2 className="serif text-white">Proven <i>Intelligence</i></h2>
            <p className="text-secondary">Run our interactive scraper to analyze local market capacity and projected online profit margins before we design.</p>
            
            <div className="steps-stack">
              <div className="step-item">
                <div className="step-num mono">01</div>
                <div className="step-text">
                  <h4 className="text-white font-medium">Input Target Parameters</h4>
                  <p>Enter your business name and location to define the scraper audit zone.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num mono">02</div>
                <div className="step-text">
                  <h4 className="text-white font-medium">Run Scraper Scan</h4>
                  <p>Our algorithms fetch local traffic data and construct a mock Report card instantly.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: 3D Transformed Scraper Tool Panel */}
          <div className="productivity-right-col reveal-text">
            <div className="mockup-window-3d glass-panel">
              {/* Window Control Bar */}
              <div className="window-bar">
                <div className="bar-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="window-title mono">market_scraper.exe</span>
              </div>
              
              {/* Internal Content (The Scraper Tool) */}
              <div className="window-content">
                <div className="analytics-card">
                  <form id="analytics-form" className="analytics-form" onSubmit={handleSubmit}>
                    <div className="input-row">
                      <div className="input-group">
                        <label className="mono" htmlFor="biz-name">Business / Shop Name</label>
                        <input 
                          type="text" 
                          id="biz-name" 
                          placeholder="e.g. Peak Coffee" 
                          value={bizName}
                          onChange={(e) => setBizName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="input-group">
                        <label className="mono" htmlFor="biz-location">Location</label>
                        <input 
                          type="text" 
                          id="biz-location" 
                          placeholder="e.g. Indiranagar, Bengaluru" 
                          value={bizLocation}
                          onChange={(e) => setBizLocation(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <button type="submit" className="analyze-btn inline-action-btn" disabled={loading}>
                      <span className="btn-text" style={{ display: loading ? 'none' : 'block' }}>Run Scraper Audit</span>
                      {loading && <div className="btn-loader"></div>}
                    </button>
                  </form>

                  {/* Scraper Results */}
                  {results && (
                    <div id="analytics-results" className="analytics-results">
                      <div className="result-header">
                        <h3 className="serif text-white">Scraper Report</h3>
                        <p className="mono text-emerald" id="result-biz-name">Target: {results.name} ({results.location})</p>
                      </div>
                      <div className="stats-grid">
                        <div className="stat-box">
                          <div className="stat-label mono">Market Size (TAM)</div>
                          <div className="stat-value">{formatCurrency(results.tam)}</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-label mono">Customers / Month</div>
                          <div className="stat-value">{formatNumber(results.customers)}</div>
                        </div>
                        <div className="stat-box accent-box">
                          <div className="stat-label mono">Online Profit Potential</div>
                          <div className="stat-value text-emerald">{formatCurrency(results.profit)}</div>
                          <div className="stat-sub">Estimated Annual Increase</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bouncing Status Tag */}
              <div className="bouncing-status-tag mono">
                <span className="pulse-dot"></span>
                SYSTEM_ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
