import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BessieCallProcess } from './BessieCallProcess';
import { Section, SectionHeader, Reveal, Counter } from './Layout';
import { IndustryDisruption } from './IndustryDisruption';

export const InvestorPortal = ({ onViewChange }: { onViewChange: (view: 'landing' | 'portal') => void }) => {
  const [trajVisible, setTrajVisible] = useState(false);

  useEffect(() => {
    // Reveal observer for sections using the class directly
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObs.observe(el);
    });

    // Animate bars
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'traj') {
            setTrajVisible(true);
          }
          document.querySelectorAll('.comp-row, .traj-row').forEach((row: any) => {
            const val = parseInt(row.dataset.val || row.dataset.pct);
            const max = parseInt(row.dataset.max || '100');
            const fill = row.querySelector('.comp-bar-fill, .traj-bar');
            if (fill) {
              setTimeout(() => {
                fill.style.width = (val / max * 100).toFixed(1) + '%';
              }, 100);
            }
          });
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const barsEl = document.getElementById('bars');
    const trajEl = document.getElementById('traj');
    if (barsEl) barObs.observe(barsEl);
    if (trajEl) barObs.observe(trajEl);

    return () => {
      revealObs.disconnect();
      barObs.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink pt-16">
      {/* VERIFIED BANNER */}
      <div className="bg-brand px-6 md:px-16 py-3.5 flex items-center justify-between border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#C4A47C] rounded-full flex-shrink-0 animate-pulse"></div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Verified Investor Access</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C4A47C] hidden sm:inline">[Institutional Partner]</span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">NDA Active · Confidential</span>
      </div>

      {/* OPENING */}
      <div className="min-h-[70vh] flex flex-col justify-end px-6 md:px-16 py-24 relative overflow-hidden bg-[#0A110C] tech-grid">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A110C] via-[#0A110C]/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent flex items-center gap-3 mb-8 before:content-[''] before:block before:w-8 before:h-px before:bg-accent">Institutional Thesis</div>
          <h1 className="font-serif text-[clamp(40px,8vw,112px)] font-normal leading-[0.88] tracking-tighter text-white max-w-[1200px] mb-16">
            They spent $300M<br />
            so we didn't have to.<br />
            <em className="italic text-white">We just had to build<br />what comes next.</em>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-12 lg:gap-24 items-end">
            <p className="text-lg leading-relaxed text-white/60 max-w-[480px] font-light">
              Someone spent three hundred million dollars proving ranchers will pay for livestock intelligence. They de-risked the category, trained the market, and established that this data has institutional value. <strong className="text-white font-medium">We didn't have to spend that $300 million. We just had to walk across the street.</strong>
            </p>
            <div className="flex justify-between md:justify-start lg:justify-end gap-4 sm:gap-8 lg:gap-20 flex-nowrap">
              {[
                { n: '$2B', l: 'The floor they set' },
                { n: '$300M', l: 'They spent to prove it' },
                { n: '$0', l: 'We spent on that proof' }
              ].map((stat, i) => (
                <div key={i} className="flex-shrink-0">
                  <div className="font-serif text-[clamp(24px,4vw,44px)] font-bold text-white leading-none mb-2">{stat.n}</div>
                  <div className="text-[8px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase text-white/30 whitespace-nowrap">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STARBUCKS COMPARISON */}
      <section className="reveal px-6 md:px-16 py-24 border-t border-rule">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">The Positioning</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-6">Our lowest version is their <em className="text-accent">best edition.</em></h2>
              <p className="text-muted leading-relaxed font-light mb-4">Remember the coffee shops? Independent cafés that proved people would pay $4 for a cup of coffee. Then Starbucks opened across the street — same category, better margin, better data, a loyalty system that turned customers into a revenue engine.</p>
              <p className="text-muted leading-relaxed font-light">The original shops validated the category. Starbucks just decided to own what came next. <strong className="text-ink font-medium">We're not here to compete with the floor. We're here to own the ceiling — and the ceiling hasn't been priced yet.</strong></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-rule border border-rule mt-12 lg:mt-0">
              <div className="bg-bg p-8 md:p-10">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted mb-5 block">The behavioral layer · proven</span>
                <div className="font-serif text-2xl text-muted mb-6 leading-tight">The coffee shop across the street.</div>
                <div className="flex flex-col">
                  {[
                    { a: 'Measurement', v: 'Behavior (inferred)' },
                    { a: 'Data type', v: 'Behavioral record' },
                    { a: 'Primary buyer', v: 'Ranchers' },
                    { a: 'Revenue streams', v: '1 (SaaS)' },
                    { a: 'Data royalty', v: 'None' },
                    { a: 'Infrastructure cost', v: 'High' },
                    { a: 'Valuation', v: '$2B · the floor', s: true }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 py-3.5 border-t border-rule first:border-t-0">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted">{row.a}</span>
                      <span className={`text-xs text-right ${row.s ? 'text-ink font-bold' : 'text-muted'}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-accent/5 p-8 md:p-10">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent mb-5 block">CacheCow · the next layer</span>
                <div className="font-serif text-2xl text-ink mb-6 leading-tight">We opened across the street.</div>
                <div className="flex flex-col">
                  {[
                    { a: 'Measurement', v: 'Physiology (direct)' },
                    { a: 'Data type', v: 'Clinical database' },
                    { a: 'Primary buyer', v: 'Pharma, insurance, gov' },
                    { a: 'Revenue streams', v: '4 (SaaS + 3 licensing)' },
                    { a: 'Data royalty', v: '50/50 permanent' },
                    { a: 'Infrastructure cost', v: 'Zero' },
                    { a: 'Valuation', v: 'Unpriced. Above the floor.', s: true }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 py-3.5 border-t border-rule/50 first:border-t-0">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-accent">{row.a}</span>
                      <span className={`text-xs text-right text-accent ${row.s ? 'font-bold' : 'font-medium'}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATIONAL ALPHA */}
      <section className="reveal px-6 md:px-16 py-24 border-t border-rule bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">Operational Alpha</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-6">They're already losing this money. <em className="text-accent">Every single year.</em></h2>
              <p className="text-muted leading-relaxed font-light mb-4">The $237,250+ annual alpha isn't a projection built on optimism. It's the sum of four measurable losses that happen on every operation, every year, without CacheCow. The rancher isn't buying a product. <strong className="text-ink font-medium">They're stopping a leak.</strong></p>
              <p className="text-muted leading-relaxed font-light mb-8">And when the rancher stops the leak, the data generated in doing so becomes an asset that pharma, insurance, and commodity finance pay to access permanently. The operational savings are the entry point. The royalty is the compounding return.</p>
              <p className="font-serif text-lg italic leading-relaxed pl-5 border-l-2 border-accent/30 mb-3 text-ink/80">
                "I stopped missing heat cycles. At $300 to $500 per missed conception across a 500-head herd, that's real money I was leaving on the table every single year. Now Bessie tells me herself."
              </p>
              <div className="text-[10px] tracking-[0.14em] uppercase text-muted/70 pl-5">
                — [Rancher Name] · [Location, Province] · [X]-head dairy operation
              </div>
            </div>
            <div>
              <div className="border border-rule bg-white">
                {[
                  { l: 'Veterinary OPEX reduction', b: 'Bio-magnetic sensing detects physiological stress 24–72 hours before visible signs. Emergency calls become scheduled interventions.', v: '$37,500/yr' },
                  { l: 'Mortality risk mitigation', b: '24/7 health trajectory monitoring catches biological drift before it becomes a loss. Industry mortality rate 2–4% annually.', v: '$24,000/yr' },
                  { l: 'Genetic breeding optimization', b: 'Bio-magnetic cycling signatures raise estrus detection from 50–60% to 95%+. Every missed heat cycle costs $300–500 in lost conception.', v: '$150,000/yr' },
                  { l: 'Permanent data royalty', b: 'The rancher owns their data. CacheCow licenses it to pharma and insurers. The 50/50 split is contractually permanent.', v: '$25,750/yr' }
                ].map((win, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-5 p-6 border-b border-rule hover:bg-black/5 transition-colors">
                    <div className="text-xs leading-relaxed text-muted">
                      <strong className="block text-sm text-ink font-bold mb-1">{win.l}</strong>
                      {win.b}
                    </div>
                    <div className="font-serif text-2xl font-bold text-accent whitespace-nowrap text-left sm:text-right">
                      {win.v}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-5 p-6 bg-ink">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/40">Total annual alpha · 500-head operation</div>
                    <div className="text-[11px] text-white/30 mt-1">Compounds every year the data deepens.</div>
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#C4A47C] whitespace-nowrap">$237,250+</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 border border-rule bg-white" id="traj">
            <div className="px-6 py-4 border-b border-rule flex items-center justify-between bg-black/5">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted">5-Year Cumulative Value Trajectory</span>
              <span className="text-[10px] text-muted/70 tracking-wider">500-head · all four shifts</span>
            </div>
            <div className="flex flex-col">
              {[
                { y: 'Year 1', p: 20, v: '$237K' },
                { y: 'Year 2', p: 42, v: '$499K' },
                { y: 'Year 3', p: 63, v: '$775K' },
                { y: 'Year 4', p: 82, v: '$1.06M' },
                { y: 'Year 5', p: 100, v: '$1.37M' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 px-6 py-4 border-b border-rule last:border-b-0 hover:bg-black/5 transition-colors traj-row" data-pct={row.p}>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted">{row.y}</span>
                  <div className="h-2 bg-rule relative overflow-hidden rounded-full">
                    <div className="h-full bg-accent transition-[width] duration-[1400ms] ease-out w-0 traj-bar rounded-full"></div>
                  </div>
                  <span className="font-serif text-base font-bold text-accent whitespace-nowrap min-w-[80px] text-right">{row.v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[64px_1fr_auto] items-center gap-4 px-6 py-4 bg-ink">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40">5-yr total</span>
              <div></div>
              <span className="font-serif text-xl font-bold text-[#C4A47C] whitespace-nowrap text-right">
                <Counter value={trajVisible ? 1821250 : 0} duration={1.5} prefix="$" suffix="+" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET DISRUPTION */}
      <Section id="disruption" className="bg-bg border-t border-rule">
        <SectionHeader 
          num="04 — Market Disruption"
          title="Three industries structurally mis-priced. One dataset changes all of them."
          lead="Insurance, genetics, and veterinary medicine have each been operating blind. The Motion Intelligence Index gives them what they've never had."
        />
        <IndustryDisruption minimal={true} />
      </Section>

      {/* UNIT ECONOMICS */}
      <section className="reveal px-6 md:px-16 py-24 bg-white border-t border-rule">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">Unit Economics</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-6">$75 device. $50/year. <em className="text-accent">No infrastructure.</em></h2>
              <p className="text-muted leading-relaxed font-light mb-4">No towers. No base stations. No cellular contracts. The mesh network is built into the devices themselves. <strong className="text-ink font-medium">The network is the herd.</strong> Every unit added strengthens the mesh. The infrastructure cost is zero because the architecture eliminates the need for it.</p>
              <p className="text-muted leading-relaxed font-light">The cost comparison doesn't fully capture the advantage. Every other platform is a pure cost tool. CacheCow is the only system where the rancher's investment generates an independent return stream — the data royalty — that exists completely outside of the operational savings.</p>
              <div className="mt-10 p-8 border border-rule bg-bg">
                <div className="grid grid-cols-2 gap-6 border-b border-rule pb-6 mb-6">
                  <div>
                    <div className="font-serif text-4xl font-bold text-accent leading-none mb-2">$162,500</div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-muted">CacheCow · 5-year total · 500 head</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-4xl font-bold text-muted/50 leading-none mb-2">$388,800</div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-muted">Market leader · 5-year total</div>
                  </div>
                </div>
                <div className="text-xs text-accent font-bold tracking-wider uppercase">$226,300 saved over 5 years — before royalty income.</div>
              </div>
            </div>
            <div>
              <div className="border border-rule bg-white" id="bars">
                <div className="px-6 py-5 border-b border-rule bg-black/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted">5-Year Total Cost · 500-Head Operation</span>
                  <span className="text-[10px] text-muted/70">USD · all-in</span>
                </div>
                <div className="flex flex-col">
                  {[
                    { n: 'CacheCow', v: 162500, m: 585000, s: 'Lowest total cost of any platform', hi: true },
                    { n: 'CowManager (Lely)', v: 230000, m: 585000, s: '$67,500 more · behavioral only' },
                    { n: 'Nofence', v: 272000, m: 585000, s: '$109,500 more · no royalty model' },
                    { n: 'Gallagher eShepherd', v: 295000, m: 585000, s: '$132,500 more · no royalty model' },
                    { n: 'Market Leader', v: 388800, m: 585000, s: '$226,300 more · behavioral only · no royalty' },
                    { n: 'Allflex / SenseHub', v: 585000, m: 585000, s: '$422,500 more · premium tier' }
                  ].map((row, i) => (
                    <div key={i} className={`p-5 border-b border-rule last:border-b-0 transition-colors comp-row ${row.hi ? 'bg-accent/10' : 'bg-white hover:bg-black/5'}`} data-val={row.v} data-max={row.m}>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className={`text-sm ${row.hi ? 'text-ink font-bold' : 'text-muted font-medium'}`}>{row.n}</span>
                        <span className={`font-serif text-lg font-bold ${row.hi ? 'text-accent' : 'text-muted'}`}>${row.v.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-rule overflow-hidden rounded-full">
                        <div className={`h-full transition-[width] duration-[1400ms] ease-out w-0 comp-bar-fill rounded-full ${row.hi ? 'bg-accent' : 'bg-muted/40'}`}></div>
                      </div>
                      <div className={`text-[10px] font-bold tracking-widest uppercase mt-2.5 ${row.hi ? 'text-accent' : 'text-muted/70'}`}>{row.s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="reveal px-6 md:px-16 py-32 border-t border-rule bg-[#0A110C] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-6 block">The Team // 07</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[0.9]">
                Proven Builders.<br />
                Legendary Validators.
              </h2>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Combined Exits</div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-[#F58220]">$200M+</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-l border-white/10">
            {[
              { 
                r: 'Founder // CEO', 
                n: 'Khayyam Wakil', 
                b: 'Award-winning technologist. Former CSO at Live Planet ($60M raise). MIT-trained AI/CSAIL. Won Cannes Lions, Grand Prix, first Emmy as CIO at Immersive Media. Built 3D-VR systems and leveraged Google Street View tech into $100M acquisition.', 
                e: 'AI // VR // Scale' 
              },
              { 
                r: 'Co-Founder // Architecture', 
                n: 'Dean Brennan', 
                b: 'Director of Enterprise Architecture at Fiix/Rockwell Automation. Built RFID systems at lululemon, Applied Research at SAIT. Pure Mathematics/Economics from University of Calgary. Expert in R&D, IoT, and high-performance delivery systems.', 
                e: 'IoT // RFID // Math' 
              },
              { 
                r: 'Co-Founder // Strategy', 
                n: 'Adam Morand', 
                b: '30+ years, multiple exits across fintech and agtech. Pioneered eSports payments (1999). Founded HerdWhistle (livestock IoT), PhantomOmics (genomics), A4 Systems. Deep livestock technology experience meets proven exit track record.', 
                e: 'AgTech // Fintech' 
              }
            ].map((tm, i) => (
              <div key={i} className="p-8 md:p-12 border-r border-b border-white/10 flex flex-col h-full hover:bg-white/5 transition-colors">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-12">{tm.r}</div>
                <div className="font-serif text-3xl md:text-4xl font-bold text-white mb-8">{tm.n}</div>
                <p className="text-[15px] leading-relaxed text-white/70 font-light mb-16 flex-grow">{tm.b}</p>
                
                <div className="pt-8 border-t border-white/10">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Expertise</div>
                  <div className="text-xl font-medium text-white">{tm.e}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEMANTIC LAYER */}
      <Section id="bessie-call" className="bg-bg border-t border-rule">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            num="The Semantic Layer"
            title="Bessie calls the rancher. The biological narrative comes alive."
            lead="Raw biometric data is useless in the field. We translate 400Hz motion signals into natural, multi-turn dialogue."
          />
          <BessieCallProcess />
        </div>
      </Section>

      {/* ROADMAP */}
      <section className="reveal px-6 md:px-16 py-32 border-t border-rule bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-16 lg:gap-24 items-start">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">The Roadmap</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-8">From 500 cows to <em className="text-accent">500,000.</em></h2>
              <p className="text-muted leading-relaxed font-light text-lg">We aren't building a product. We're building a clinical-grade infrastructure for the $2.5T livestock asset class. The milestones are measured in biological signals captured and markets entered.</p>
              <div className="mt-12 p-8 border border-rule bg-bg rounded-xl">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4">Current Status</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-lg font-bold text-ink">Pilot Phase: Fisher Creek, AB</span>
                </div>
                <p className="text-sm text-muted leading-relaxed font-light">500-head deployment active. Bio-magnetic sensors v1.8 operational. Mesh network stability verified. Data ingestion at 400Hz.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-px bg-rule border border-rule rounded-xl overflow-hidden">
              {[
                { q: 'Q2 2024', t: 'Pilot Expansion', b: 'Deployment across three additional operations in Alberta and Montana. Total herd count: 2,500. Initial insurance underwriting data feed live.' },
                { q: 'Q4 2024', t: 'Bio-magnetic v2.0', b: 'Launch of the Forcedfield SoC v2. 40% reduction in power consumption. 2x sensor frequency. Integrated ternary logic processing.' },
                { q: 'Q2 2025', t: 'Data Licensing Layer', b: 'First institutional data licensing agreement with Global Pharma. 50/50 royalty split activated for all pilot ranchers.' },
                { q: 'Q4 2025', t: 'Sovereign Wealth Partnership', b: 'Infrastructure-level deployment for national food security initiatives in the GCC region. 100k+ head target.' }
              ].map((rm, i) => (
                <div key={i} className="bg-white p-10 hover:bg-black/5 transition-colors">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">{rm.q}</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50">Milestone {i + 1}</span>
                  </div>
                  <div className="font-serif text-2xl font-bold text-ink mb-4 leading-tight">{rm.t}</div>
                  <p className="text-sm leading-relaxed text-muted font-light">{rm.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VAULT CTA */}
      <section className="reveal px-6 md:px-16 py-32 border-t border-rule bg-bg" id="vault">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-[600px]">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4 block">Document Vault</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-6">Three documents. <em className="text-accent">The complete picture.</em></h2>
            <p className="text-muted leading-relaxed font-light text-lg">Each document unlocks with a single request. We follow up within 24 hours with access and a personal note from the team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'deck', num: 'Document 01', icon: '◈', tag: 'First Look Deck', title: 'The Full Narrative', body: 'Market, architecture, traction, team, and the structural reason this opportunity exists now.' },
              { id: 'model', num: 'Document 02', icon: '◉', tag: 'Financial Model', title: 'The Numbers', body: 'Unit economics, detailed revenue projections, data licensing assumptions, and royalty curves.' },
              { id: 'whitepaper', num: 'Document 03', icon: '◆', tag: 'Whitepaper', title: 'The Architecture', body: 'The biological time-series algorithms, Base 9 ternary architecture, and quantum fencing specs.' }
            ].map((doc, i) => (
              <Link key={i} to="/vault" className="border border-rule p-10 cursor-pointer transition-all bg-white hover:border-accent hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 text-left relative group rounded-xl block no-underline">
                <div className="absolute top-6 right-6 text-[9px] font-bold tracking-[0.1em] uppercase text-muted/50">View Document</div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50 mb-8 block">{doc.num}</span>
                <div className="w-10 h-10 border border-rule rounded-lg flex items-center justify-center mb-6 text-accent text-lg group-hover:border-accent transition-colors bg-bg">{doc.icon}</div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-3 block">{doc.tag}</span>
                <div className="font-serif text-2xl font-bold text-ink mb-4 leading-tight">{doc.title}</div>
                <p className="text-sm leading-relaxed text-muted font-light mb-8">{doc.body}</p>
                <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-ink flex items-center gap-2 group-hover:gap-3 group-hover:text-accent transition-all">View Document →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2A2015] px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
        <div className="font-serif text-xl font-bold text-white/50">CacheCow</div>
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/30">Product of Canada · © CacheCow 2026 · NDA Active</span>
      </footer>
    </div>
  );
}
