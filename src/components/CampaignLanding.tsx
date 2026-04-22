import React from 'react';

export const CampaignLanding = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cc-page {
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
          max-width: 900px;
          margin: 0 auto;
          background-color: var(--color-paper);
          min-height: 100vh;
        }

        .cc-hero {
          padding: 4rem 2rem 3rem;
          border-bottom: 0.5px solid var(--color-rule);
        }

        .cc-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 1.25rem;
        }

        .cc-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          max-width: 680px;
          margin-bottom: 1.5rem;
        }

        .cc-headline em {
          font-style: italic;
          color: var(--color-muted);
        }

        .cc-subhead {
          font-size: 17px;
          font-weight: 300;
          line-height: 1.7;
          max-width: 560px;
          color: var(--color-muted);
          margin-bottom: 2rem;
        }

        .cc-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .cc-btn-primary {
          background: var(--color-ink);
          color: var(--color-paper);
          border: none;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .cc-btn-primary:hover { opacity: 0.8; }

        .cc-btn-secondary {
          background: transparent;
          color: var(--color-ink);
          border: 0.5px solid var(--color-ink);
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cc-btn-secondary:hover { background: var(--color-bg); }

        .cc-truth {
          padding: 3rem 2rem;
          border-bottom: 0.5px solid var(--color-rule);
        }

        .cc-section-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-mid);
          margin-bottom: 1rem;
        }

        .cc-truth-statement {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 400;
          line-height: 1.4;
          max-width: 620px;
          margin-bottom: 2rem;
        }

        .cc-stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 2rem;
        }

        .cc-stat-card {
          background: var(--color-bg);
          border-radius: 8px;
          padding: 1.25rem 1rem;
        }

        .cc-stat-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 6px;
        }

        .cc-stat-label {
          font-size: 13px;
          color: var(--color-muted);
          line-height: 1.4;
        }

        .cc-stages {
          padding: 3rem 2rem;
          border-bottom: 0.5px solid var(--color-rule);
        }

        .cc-stages-intro {
          max-width: 560px;
          font-size: 16px;
          line-height: 1.7;
          color: var(--color-muted);
          margin-bottom: 2.5rem;
        }

        .cc-stage-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .cc-stage {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 16px;
          padding: 1.5rem 0;
          border-bottom: 0.5px solid var(--color-rule);
          align-items: start;
        }
        .cc-stage:last-child { border-bottom: none; }

        .cc-stage-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-mid);
          line-height: 1;
          padding-top: 2px;
        }

        .cc-stage-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .cc-stage-desc {
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.6;
        }

        .cc-stage-you {
          display: inline-block;
          margin-top: 8px;
          font-size: 12px;
          font-weight: 500;
          background: var(--color-green-light);
          color: var(--color-brand);
          padding: 3px 10px;
          border-radius: 8px;
        }

        .cc-vision {
          padding: 3rem 2rem;
          border-bottom: 0.5px solid var(--color-rule);
        }

        .cc-vision-quote {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.2rem, 2.5vw, 1.65rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.5;
          max-width: 600px;
          padding-left: 1.5rem;
          border-left: 2px solid var(--color-accent);
          margin-bottom: 2rem;
        }

        .cc-vision-body {
          font-size: 16px;
          line-height: 1.75;
          color: var(--color-muted);
          max-width: 580px;
        }

        .cc-pilot {
          padding: 3rem 2rem;
          border-bottom: 0.5px solid var(--color-rule);
        }

        .cc-pilot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 2rem 0;
        }

        @media (max-width: 560px) {
          .cc-pilot-grid { grid-template-columns: 1fr; }
        }

        .cc-pilot-card {
          background: var(--color-paper);
          border: 0.5px solid var(--color-rule);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .cc-pilot-card-title {
          font-size: 11px;
          font-weight: 500;
          color: var(--color-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .cc-pilot-card-body {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-ink);
        }

        .cc-pilot-cta {
          background: var(--color-bg);
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cc-pilot-cta-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.3;
          max-width: 440px;
        }

        .cc-pilot-cta-sub {
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.6;
          max-width: 420px;
        }

        .cc-footer-bar {
          padding: 2rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cc-footer-brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .cc-footer-link {
          font-size: 13px;
          color: var(--color-muted);
          text-decoration: none;
          cursor: pointer;
        }
        .cc-footer-link:hover { color: var(--color-ink); }

        .cc-divider {
          border: none;
          border-top: 0.5px solid var(--color-rule);
          margin: 0;
        }
      `}</style>

      <div className="bg-paper min-h-screen">
        <div className="cc-page">
          <div className="cc-hero">
            <p className="cc-eyebrow">CacheCow &nbsp;·&nbsp; Precision Livestock Intelligence</p>
            <h1 className="cc-headline">Your herd is moving.<br/><em>Are you moving with it?</em></h1>
            <p className="cc-subhead">Cattle operations are shifting from reactive herd management to predictive individual animal intelligence. Every operation goes through four stages. Let's find out where yours is.</p>
            <div className="cc-cta-row">
              <button className="cc-btn-primary" onClick={() => alert('I want to apply for a CacheCow pilot program. What does that look like?')}>Apply for a pilot ↗</button>
              <button className="cc-btn-secondary" onClick={() => alert('Walk me through the four stages of cattle operation intelligence')}>See the four stages</button>
            </div>
          </div>

          <div className="cc-truth">
            <p className="cc-section-label">The uncomfortable truth</p>
            <p className="cc-truth-statement">"By the time you see a sick animal, you've already lost the fight. The industry calls that early detection. It isn't. It's just fast reaction."</p>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: '560px' }}>Most cattle operations absorb losses every year that aren't bad luck — they're a data problem. The tools the industry has relied on weren't built for individual animals. They were built for the herd, and they were built decades ago.</p>
            <div className="cc-stat-row">
              <div className="cc-stat-card">
                <p className="cc-stat-num">2–4%</p>
                <p className="cc-stat-label">Annual herd loss from preventable illness, industry average</p>
              </div>
              <div className="cc-stat-card">
                <p className="cc-stat-num">$2,500</p>
                <p className="cc-stat-label">Average reactive treatment cost per animal once symptoms appear</p>
              </div>
              <div className="cc-stat-card">
                <p className="cc-stat-num">$150</p>
                <p className="cc-stat-label">Preventive intervention cost with 48-hour advance warning</p>
              </div>
              <div className="cc-stat-card">
                <p className="cc-stat-num">$24,500</p>
                <p className="cc-stat-label">Preventable annual loss on a 1,000-head operation</p>
              </div>
            </div>
          </div>

          <div className="cc-stages">
            <p className="cc-section-label">Where are you?</p>
            <p className="cc-stages-intro">Every operation moves through four stages on the way to individual animal intelligence. Most are stuck at stage one or two — not from lack of ambition, but because the tools to go further haven't existed. Until now.</p>
            <div className="cc-stage-list">
              <div className="cc-stage">
                <p className="cc-stage-num">01</p>
                <div>
                  <p className="cc-stage-title">Managing by observation</p>
                  <p className="cc-stage-desc">Experience, gut, and a morning walk. You know your animals, but you're limited to what you can see. Losses are accepted as part of the business.</p>
                </div>
              </div>
              <div className="cc-stage">
                <p className="cc-stage-num">02</p>
                <div>
                  <p className="cc-stage-title">Reactive monitoring</p>
                  <p className="cc-stage-desc">Tags, boluses, alerts — but they fire after the problem starts. You're still losing the same animals. You just have more paperwork.</p>
                </div>
              </div>
              <div className="cc-stage">
                <p className="cc-stage-num">03</p>
                <div>
                  <p className="cc-stage-title">Predictive intelligence</p>
                  <p className="cc-stage-desc">Individual AI-powered monitoring. Illness flagged 48–72 hours before symptoms. Vet interventions drop from $2,500 to $150. You stop losing animals you shouldn't lose.</p>
                  <span className="cc-stage-you">This is where CacheCow takes you</span>
                </div>
              </div>
              <div className="cc-stage">
                <p className="cc-stage-num">04</p>
                <div>
                  <p className="cc-stage-title">Intelligence-led operation</p>
                  <p className="cc-stage-desc">Your herd teaches itself. Every calving cycle, breeding season, and illness event makes the system smarter. Individual animal histories drive culling, genetics, and feed decisions. The data becomes an asset.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cc-vision">
            <p className="cc-section-label">The vision</p>
            <p className="cc-vision-quote">"Every animal on earth deserves the kind of attention a racehorse gets."</p>
            <p className="cc-vision-body">A racehorse has a team monitoring every biometric in real time. A $2,000 beef animal gets a visual check at feeding time. That gap isn't about economics — it's about what's been possible. CacheCow closes it. On-device AI that knows each animal individually. No cloud dependency, no cell coverage required, no annual battery swap. It runs in the pasture, learns overnight while the herd sleeps, and gets smarter every single day.</p>
          </div>

          <div className="cc-pilot">
            <p className="cc-section-label">Pilot program</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, maxWidth: '540px', marginBottom: '1rem' }}>We're selecting a small number of operations for our founding pilot cohort.</p>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '1.5rem' }}>This isn't a sales process. It's a diagnostic. We'll map your operation to the four stages, show you exactly what Stage 3 looks like in practice, and let the numbers speak for themselves.</p>
            <div className="cc-pilot-grid">
              <div className="cc-pilot-card">
                <p className="cc-pilot-card-title">What you get</p>
                <p className="cc-pilot-card-body">Full deployment across a defined portion of your herd. Real-time individual health monitoring. 48–72 hour illness prediction. Breeding and feed optimization insights. Dedicated support throughout.</p>
              </div>
              <div className="cc-pilot-card">
                <p className="cc-pilot-card-title">What we're looking for</p>
                <p className="cc-pilot-card-body">Operations of 500 head or more. Owners or managers willing to engage with the data. A genuine curiosity about what individual animal intelligence looks like at scale. No tech background required.</p>
              </div>
            </div>
            <div className="cc-pilot-cta">
              <p className="cc-pilot-cta-headline">Ready to find out what stage your operation is at?</p>
              <p className="cc-pilot-cta-sub">Takes 10 minutes. No commitment. We'll tell you exactly where you stand and whether CacheCow makes sense for your operation.</p>
              <div>
                <button className="cc-btn-primary" onClick={() => alert('I want to apply for the CacheCow pilot program. Walk me through it.')}>Start the conversation ↗</button>
              </div>
            </div>
          </div>

          <hr className="cc-divider" />
          <div className="cc-footer-bar">
            <span className="cc-footer-brand">CacheCow</span>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span className="cc-footer-link" onClick={() => alert('Tell me more about the CacheCow technology')}>How it works</span>
              <span className="cc-footer-link" onClick={() => alert('What does the CacheCow pilot program involve?')}>Pilot program</span>
              <span className="cc-footer-link" onClick={() => alert('What is CacheCow competitive advantage over existing livestock monitoring?')}>Why CacheCow</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
