import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Reveal, SectionHeader, Counter } from './Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { cn } from '../lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const disruptions = [
  {
    num: "01",
    title: "Insurance Arbitrage",
    sub: "From actuarial averages to per-animal dynamic risk scores",
    detailTitle: "Livestock risk repriced",
    quote: "Right now a healthy 4-year-old dairy cow with perfect vitals pays the same premium as her herd-mate who had two respiratory events last winter. The MII ends that. Every animal gets a risk score that reflects her actual biology, not the average of 10,000 animals that vaguely resemble her.",
    details: [
      { label: "Pricing unit", current: "Herd / farm class", mii: "Individual animal", impact: "10x accuracy" },
      { label: "Data inputs", current: "Historical claims, age, breed", mii: "Continuous biosignals + trajectory", impact: "Real-time risk" },
      { label: "Update frequency", current: "Annual renewal", mii: "Continuous (daily score)", impact: "Dynamic pricing" },
      { label: "Moral hazard", current: "High — rancher hides issues", mii: "Low — data is objective", impact: "Aligned incentives" },
      { label: "Claims fraud", current: "Difficult to detect", mii: "Trajectory mismatch flags anomalies", impact: "Auto-audit" },
      { label: "Healthy animal benefit", current: "None — pays pool rate", mii: "Lower premium reflects real health", impact: "Rewards good ranching" }
    ],
    metrics: [
      { label: 'Current livestock insurance model', val: 'Actuarial avg', sub: 'Same rate for every animal in class' },
      { label: 'MII insurance model', val: 'Per-animal', sub: 'Dynamic risk score · updated continuously', accent: 'green' },
      { label: 'Premium accuracy improvement', val: 10, suffix: 'x', sub: 'Individual vs. population pricing', accent: 'blue' },
      { label: 'Global livestock insurance market', val: 3.2, prefix: '$', suffix: 'B', sub: 'Ripe for repricing', accent: 'amber' }
    ]
  },
  {
    num: "02",
    title: "Genetic Alpha",
    sub: "From 5–7 year progeny testing to real-time parent analysis",
    detailTitle: "Genetic discovery without waiting a generation",
    quote: "To know if a bull has elite genetics, you historically had to wait a generation. You breed him, wait for the offspring to be born, grow up, and then measure their performance. The MII gives you the parent's complete biological autobiography in real time.",
    details: [
      { label: "Traditional progeny test", years: 6, color: "#4A4A48" },
      { label: "Genomic SNP chip (lab)", years: 2, color: "#8E8E8A" },
      { label: "MII continuous (parent time series)", years: 0.25, color: "#2D9E75" }
    ],
    metrics: [
      { label: 'Traditional progeny testing timeline', val: 7, suffix: ' years', sub: 'Breed → wait → measure offspring' },
      { label: 'MII genetic discovery timeline', val: 18, suffix: ' months', sub: 'Continuous parent time series', accent: 'green' },
      { label: 'What you can find without breeding', val: 'Genetic outliers', sub: 'Resilience · efficiency · longevity markers', accent: 'blue' },
      { label: 'Elite semen value premium', val: 500, prefix: '$', suffix: '+', sub: 'Per straw · confirmed genetics command premium', accent: 'amber' }
    ]
  },
  {
    num: "03",
    title: "Predictive Biology",
    sub: "From symptom detection to trajectory prediction",
    detailTitle: "Predictive rather than reactive",
    quote: "\"Is Bessie sick?\" is the wrong question. The right question is: Is Bessie's biological trajectory over the last 72 hours consistent with the pattern that preceded a health crash in 87% of similar animals in the database?",
    details: [
      { day: 'Day -7', baseline: 100, bessie: 99 },
      { day: 'Day -6', baseline: 100, bessie: 97 },
      { day: 'Day -5', baseline: 99, bessie: 94 },
      { day: 'Day -6', baseline: 100, bessie: 91 },
      { day: 'Day -3', baseline: 100, bessie: 87, threshold: 88 },
      { day: 'Day -2', baseline: 99, bessie: 82, threshold: 88 },
      { day: 'Day -1', baseline: 100, bessie: 74, threshold: 88 },
      { day: 'Day 0', baseline: 100, bessie: 58, threshold: 88 }
    ],
    metrics: [
      { label: 'Current diagnostic question', val: '"Is Bessie sick?"', sub: 'Reactive · symptom-based · too late' },
      { label: 'MII diagnostic question', val: '"Is Bessie on trajectory?"', sub: 'Predictive · pattern-based · intervene early', accent: 'green' },
      { label: 'Detection lead time', val: 72, suffix: ' hrs', sub: 'Before visible clinical signs', accent: 'blue' },
      { label: 'MII crash prediction accuracy', val: 87, suffix: '%', sub: 'When trajectory matches historical crash pattern', accent: 'amber' }
    ]
  },
  {
    num: "04",
    title: "The Compounding Moat",
    sub: "Winner-take-all database advantage",
    detailTitle: "The universal biological intelligence",
    quote: "Bovine is the training ground. Agriculture is the controlled environment where you can instrument every animal, track every variable, and observe every outcome. Once the model is trained on cattle, the biomechanical and physiological principles transfer.",
    details: [
      { label: "Dynamic insurance pricing", who: "Insurers", what: "Per-animal risk score data", role: "Data licensor", benefit: "Lower premiums" },
      { label: "Genetic outlier certification", who: "Seedstock industry", what: "MII-verified performance records", role: "Registry + certifier", benefit: "Premium semen prices" },
      { label: "Predictive health alerts", who: "Ranchers", what: "Trajectory-based early warnings", role: "Platform provider", benefit: "Fewer vet bills + losses" },
      { label: "Pharmaceutical R&D data", who: "Pharma companies", what: "Large-scale real-world behavioral data", role: "Data licensor (50/50)", benefit: "Passive income" },
      { label: "Universal organism model", who: "Healthcare / defense", what: "Cross-species MII license", role: "IP owner", benefit: "Founding dataset credit" }
    ],
    metrics: [
      { label: 'Three industries disrupted', val: 'Insurance', sub: '+ genetics + predictive medicine', accent: 'green' },
      { label: 'Competitive position', val: 'Winner-take-all', sub: 'Database advantage is self-reinforcing', accent: 'blue' },
      { label: 'Transferable to any organism', val: 'Universal', sub: 'Bovine MII trains the base model', accent: 'amber' },
      { label: 'Combined market size', val: 200, prefix: '$', suffix: 'B', sub: 'Insurance + genetics + pharma + veterinary', accent: 'green' }
    ]
  }
];

export const IndustryDisruption = ({ minimal = false }: { minimal?: boolean }) => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (minimal) return;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Use a point 1/3 down the screen as the trigger line
          const triggerPoint = window.scrollY + (window.innerHeight / 3);
          
          // Go backwards to find the last element that we've scrolled past
          for (let i = disruptions.length - 1; i >= 0; i--) {
            const el = itemRefs.current[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              const elTop = rect.top + window.scrollY;
              
              if (triggerPoint >= elTop) {
                setActive(i);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check after a short delay to account for the portal slide-in animation
    const timer = setTimeout(handleScroll, 800);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [minimal]);

  const scrollToSection = (index: number) => {
    const element = itemRefs.current[index];
    if (element) {
      const offset = 120; // Account for sticky header and navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={sectionRef} className="relative py-12">
      {!minimal && (
        <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-rule mb-16 -mx-6 px-6 md:-mx-12 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {disruptions.map((d, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(i)}
                className={cn(
                  "px-2 md:px-4 py-4 md:py-5 text-[10px] md:text-[12px] font-bold tracking-widest uppercase transition-all border-b-2 relative text-center",
                  active === i ? "text-brand border-brand" : "text-muted border-transparent hover:text-brand"
                )}
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn("space-y-48", minimal && "space-y-24")}>
        {disruptions.map((d, i) => (
          <div 
            key={i} 
            ref={(el) => { itemRefs.current[i] = el; }}
            className={cn(!minimal && "scroll-mt-32")}
          >
            <div className={cn(!minimal && "mb-12")}>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-brand font-serif italic text-2xl">{d.num}</div>
                <h3 className="text-3xl font-serif font-bold text-ink">{d.title}</h3>
              </div>
              
              <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16", !minimal && "mb-12 md:mb-20")}>
                <div className="lg:col-span-7 xl:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-rule/60 h-full">
                    {d.metrics.map((m: any, idx) => (
                      <div key={idx} className="p-6 md:p-8 border-r border-b border-rule/60 hover:bg-white transition-colors group flex flex-col justify-center">
                        <div className="micro-label text-muted/60 mb-4 group-hover:text-accent transition-colors">{m.label}</div>
                        <div className="text-4xl md:text-5xl font-serif font-bold text-brand mb-3 tracking-tighter">
                          <Counter 
                            value={m.val} 
                            prefix={m.prefix} 
                            suffix={m.suffix} 
                          />
                        </div>
                        <div className="text-[11px] text-muted leading-relaxed font-light">{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 xl:col-span-4 flex items-center">
                  <div className="border-l-2 border-accent pl-6 md:pl-10 py-4 text-xl md:text-2xl lg:text-3xl font-serif font-light text-ink leading-relaxed italic">
                    "{d.quote}"
                  </div>
                </div>
              </div>

              {!minimal && (
                <div className="min-h-[400px]">
                  {i === 0 && <InsurancePanel data={d} />}
                  {i === 1 && <GeneticsPanel data={d} />}
                  {i === 2 && <PredictivePanel data={d} />}
                  {i === 3 && <MoatPanel data={d} />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InsurancePanel = ({ data }: { data: any }) => (
  <div className="space-y-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative pl-8 border-l border-rule/60">
        <div className="micro-label text-muted/40 mb-6">Before MII</div>
        <h4 className="font-serif text-2xl text-ink mb-6">How livestock insurance is priced today</h4>
        <p className="text-[16px] text-muted leading-relaxed font-light">
          Underwriters use species, age, breed, location, and historical herd loss ratios. A 500-head dairy operation in Alberta gets one rate based on what similar operations have historically claimed. Individual animal risk is invisible. Healthy animals subsidize sick ones. Insurers over-price the healthy and under-price the risky — and they know it.
        </p>
      </div>
      <div className="relative pl-8 border-l border-brand/30">
        <div className="micro-label text-brand/40 mb-6">After MII</div>
        <h4 className="font-serif text-2xl text-brand mb-6">Dynamic per-animal micro-insurance</h4>
        <p className="text-[16px] text-brand/80 leading-relaxed font-light">
          Each animal has a continuously updated risk score derived from movement patterns, bio-magnetic health signals, reproductive history, stress response data, and behavioral trajectory. A cow with a 94th-percentile health score gets a lower premium than one at the 40th percentile. Insurers can now price what they're actually insuring.
        </p>
      </div>
    </div>

    <div className="h-[400px] w-full bg-white/50 p-8 rounded-lg border border-rule/30">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            { label: 'Bottom 10%', flat: 1200, mii: 2100 },
            { label: '25th pct', flat: 1200, mii: 1600 },
            { label: '50th pct', flat: 1200, mii: 1200 },
            { label: '75th pct', flat: 1200, mii: 820 },
            { label: 'Top 10%', flat: 1200, mii: 550 }
          ]}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E2" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8E8E8A' }} />
          <YAxis tick={{ fontSize: 11, fill: '#8E8E8A' }} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={{ backgroundColor: '#0D4A2F', border: 'none', borderRadius: '12px', color: '#fff' }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
          <Bar dataKey="flat" name="Current Flat Premium" fill="#8E8E8A" opacity={0.3} />
          <Bar dataKey="mii" name="MII Dynamic Premium" fill="#2D9E75" opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <table className="w-full text-left text-[14px] border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-rule/60">
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Insurance Dimension</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Current Model</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">MII Model</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Implication</th>
          </tr>
        </thead>
        <tbody>
          {data.details.map((d: any, i: number) => (
            <tr key={i} className="border-b border-rule/40 group hover:bg-white/40 transition-colors">
              <td className="py-6 font-medium text-ink">{d.label}</td>
              <td className="py-6 text-muted/80">{d.current}</td>
              <td className="py-6 text-brand font-medium">{d.mii}</td>
              <td className="py-6">
                <span className="text-accent text-[11px] font-bold uppercase tracking-wider">
                  {d.impact}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const GeneticsPanel = ({ data }: { data: any }) => (
  <div className="space-y-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative pl-8 border-l border-rule/60">
        <h4 className="font-serif text-2xl text-ink mb-8">The old way — progeny testing</h4>
        <div className="space-y-8">
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-muted/30" />
            <div className="text-[12px] font-bold text-muted/40 uppercase tracking-widest mb-1">Year 0</div>
            <div className="text-lg font-serif text-ink mb-1">Bull enters service</div>
            <div className="text-[14px] text-muted leading-relaxed">Collected and used for AI. Price based on breed averages and visual appraisal.</div>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-muted/30" />
            <div className="text-[12px] font-bold text-muted/40 uppercase tracking-widest mb-1">Year 1</div>
            <div className="text-lg font-serif text-ink mb-1">Calves born</div>
            <div className="text-[14px] text-muted leading-relaxed">Offspring arrive. You wait. Can't measure growth, milk, or resilience in a calf.</div>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-muted/30" />
            <div className="text-[12px] font-bold text-muted/40 uppercase tracking-widest mb-1">Year 3–4</div>
            <div className="text-lg font-serif text-ink mb-1">Offspring mature</div>
            <div className="text-[14px] text-muted leading-relaxed">Daughters enter production. Finally begin collecting performance data.</div>
          </div>
        </div>
      </div>
      <div className="relative pl-8 border-l border-brand/30">
        <h4 className="font-serif text-2xl text-brand mb-8">The MII way — parent time series</h4>
        <div className="space-y-8">
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-[12px] font-bold text-accent/60 uppercase tracking-widest mb-1">Day 1</div>
            <div className="text-lg font-serif text-brand mb-1">Device on animal</div>
            <div className="text-[14px] text-brand/70 leading-relaxed">Baseline movement, bio-magnetic signature, and physiological fingerprint established.</div>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-[12px] font-bold text-accent/60 uppercase tracking-widest mb-1">Month 6</div>
            <div className="text-lg font-serif text-brand mb-1">Stress event library</div>
            <div className="text-[14px] text-brand/70 leading-relaxed">Heat waves, cold snaps, disease exposure — each reveals how this specific animal responds.</div>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[-33px] top-1.5 w-2 h-2 rounded-full bg-brand" />
            <div className="text-[12px] font-bold text-brand/60 uppercase tracking-widest mb-1">Year 1–2</div>
            <div className="text-lg font-serif text-brand mb-1">Genetic outlier ID</div>
            <div className="text-[14px] text-brand/70 leading-relaxed">Animals in the 95th percentile for stress resilience and feed efficiency are flagged.</div>
          </div>
        </div>
      </div>
    </div>

    <div className="h-[400px] w-full bg-white/50 p-8 rounded-lg border border-rule/30">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.details}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E2" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#8E8E8A' }} tickFormatter={(v) => `${v} yr`} />
          <YAxis dataKey="label" type="category" tick={{ fontSize: 11, fill: '#141413' }} width={150} />
          <Tooltip contentStyle={{ backgroundColor: '#0D4A2F', border: 'none', borderRadius: '12px', color: '#fff' }} />
          <Bar dataKey="years" name="Years to Confident Ranking">
            {data.details.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PredictivePanel = ({ data }: { data: any }) => (
  <div className="space-y-16">
    <div className="relative pl-8 border-l-2 border-accent/30 py-4">
      <h4 className="font-serif text-2xl text-ink mb-6">What a trajectory-based health model actually sees</h4>
      <p className="text-[17px] text-muted leading-relaxed max-w-4xl font-light">
        The MII doesn't just sample Bessie's vitals right now. It holds her entire time series — every movement session, every feeding sequence, every stress response since the device was fitted. When a health event approaches, it doesn't announce itself with a single abnormal reading. It manifests as a slow drift: rumination time drops 8% over four days, gait symmetry degrades slightly, resting heart rate creeps up, social clustering behavior changes. Individually, none of these trigger an alert. Collectively, they form a signature the model has seen before — 87 times out of 100, it ends in a crash.
      </p>
    </div>

    <div className="h-[400px] w-full bg-white/50 p-8 rounded-lg border border-rule/30">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.details}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E2" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8E8E8A' }} />
          <YAxis tick={{ fontSize: 11, fill: '#8E8E8A' }} domain={[50, 105]} />
          <Tooltip contentStyle={{ backgroundColor: '#0D4A2F', border: 'none', borderRadius: '12px', color: '#fff' }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
          <Line type="monotone" dataKey="baseline" name="Healthy Baseline" stroke="#2D9E75" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="bessie" name="Bessie's Trajectory" stroke="#0D4A2F" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="stepAfter" dataKey="threshold" name="Alert Threshold" stroke="#8E8E8A" strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-bg p-8 border border-rule rounded-waabi">
        <h4 className="font-serif text-xl text-ink mb-4">Reactive medicine (today)</h4>
        <div className="space-y-6">
          <div className="relative pl-6 border-l border-rule">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-muted" />
            <div className="text-sm font-medium text-ink">Day -5 to -3: Subclinical drift</div>
            <div className="text-[13px] text-muted">Animal begins diverging from baseline. Invisible to farmer.</div>
          </div>
          <div className="relative pl-6 border-l border-rule">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-muted" />
            <div className="text-sm font-medium text-ink">Day -1: Obvious behavioral change</div>
            <div className="text-[13px] text-muted">Experienced rancher might notice. Most don't until feed intake drops.</div>
          </div>
          <div className="relative pl-6 border-l border-rule">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-grey-dark" />
            <div className="text-sm font-medium text-ink">Day 0: Clinical presentation</div>
            <div className="text-[13px] text-muted">Fever, discharge, labored breathing. Emergency vet call. $200–600 cost.</div>
          </div>
        </div>
      </div>
      <div className="bg-green-light p-8 border border-brand/10 rounded-waabi">
        <h4 className="font-serif text-xl text-brand mb-4">Predictive medicine (MII)</h4>
        <div className="space-y-6">
          <div className="relative pl-6 border-l border-brand/20">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-sm font-medium text-brand">Day -5: Drift pattern recognized</div>
            <div className="text-[13px] text-brand/70">MII detects trajectory matching historical pre-crash signature.</div>
          </div>
          <div className="relative pl-6 border-l border-brand/20">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-sm font-medium text-brand">Day -3: Alert sent to rancher</div>
            <div className="text-[13px] text-brand/70">"Cow #247 is on a biological trajectory consistent with a health event."</div>
          </div>
          <div className="relative pl-6 border-l border-brand/20">
            <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-brand" />
            <div className="text-sm font-medium text-brand">Day -2: Preventive intervention</div>
            <div className="text-[13px] text-brand/70">Early supportive care administered. Cost: $30–80. Animal never crashes.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MoatPanel = ({ data }: { data: any }) => (
  <div className="space-y-16">
    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-rule/60">
      <div className="p-8 border-r border-b border-rule/60 hover:bg-white transition-colors">
        <div className="text-[10px] text-brand/60 uppercase tracking-widest mb-4 font-bold">Disruption 1</div>
        <h4 className="font-serif text-xl text-brand mb-4">Livestock insurance</h4>
        <p className="text-[14px] text-brand/70 leading-relaxed font-light">
          $3.2B market repriced from population averages to per-animal dynamic risk scores. CacheCow earns a data licensing fee from every policy written.
        </p>
      </div>
      <div className="p-8 border-r border-b border-rule/60 hover:bg-white transition-colors">
        <div className="text-[10px] text-muted/60 uppercase tracking-widest mb-4 font-bold">Disruption 2</div>
        <h4 className="font-serif text-xl text-ink mb-4">Genetic markets</h4>
        <p className="text-[14px] text-muted leading-relaxed font-light">
          Elite genetics discovery compressed from 7 years to 18 months. Semen and embryo markets gain a new certification tier: MII-verified performance.
        </p>
      </div>
      <div className="p-8 border-r border-b border-rule/60 hover:bg-white transition-colors">
        <div className="text-[10px] text-brand/60 uppercase tracking-widest mb-4 font-bold">Disruption 3</div>
        <h4 className="font-serif text-xl text-brand mb-4">Predictive medicine</h4>
        <p className="text-[14px] text-brand/70 leading-relaxed font-light">
          Reactive symptom diagnosis replaced by trajectory-based prediction. Emergency vet calls drop 60–80%. Pharma gains real-world field data.
        </p>
      </div>
    </div>

    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <table className="w-full text-left text-[14px] border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-rule/60">
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Value Layer</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Who Pays</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">What They Pay For</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">CacheCow Role</th>
            <th className="py-6 font-serif italic text-muted/60 text-[12px] uppercase tracking-widest">Rancher Benefit</th>
          </tr>
        </thead>
        <tbody>
          {data.details.map((d: any, i: number) => (
            <tr key={i} className="border-b border-rule/40 group hover:bg-white/40 transition-colors">
              <td className="py-6 font-medium text-ink">{d.label}</td>
              <td className="py-6 text-muted/80">{d.who}</td>
              <td className="py-6 text-muted/80">{d.what}</td>
              <td className="py-6 text-ink font-medium">{d.role}</td>
              <td className="py-6">
                <span className="text-accent text-[11px] font-bold uppercase tracking-wider">
                  {d.benefit}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
