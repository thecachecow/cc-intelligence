import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { Counter } from './Layout';

const HEAD = 500;
const YRS = 5;

const ccBase = { hw: 75 * HEAD, sub: 50 * HEAD * YRS };
const cc = { ...ccBase, total: ccBase.hw + ccBase.sub };

const savings = {
  vet_reduction: 60 * HEAD,
  vet_annual: 60 * HEAD * YRS,
  death_prevention: 2400 * (HEAD * 0.03),
  death_annual: 2400 * (HEAD * 0.03) * YRS,
  breeding_dairy: 300 * HEAD,
  breeding_annual: 300 * HEAD * YRS,
  feed_efficiency: 60 * HEAD * YRS,
  insurance: 250 * HEAD * YRS,
  outbreak_prevention: 2000 * (HEAD * 0.05),
};

const data_rev = {
  genomic_per_head_yr: 35,
  pharma_per_head_yr: 28,
  insurance_per_head_yr: 18,
  research_per_head_yr: 22,
  total_per_head_yr: 103,
  split: 0.5
};
const rancher_annual = data_rev.total_per_head_yr * data_rev.split * HEAD;
const rancher_5yr = rancher_annual * YRS;

type ViewType = 'costs' | 'data' | 'vet' | 'full';

export const ValueModel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const views: ViewType[] = ['costs', 'data', 'vet', 'full'];
  const [viewIndex, setViewIndex] = useState(0);
  const view = views[viewIndex];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setViewIndex(0);
    else if (latest < 0.5) setViewIndex(1);
    else if (latest < 0.75) setViewIndex(2);
    else setViewIndex(3);
  });

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  const totalSavings5yr = savings.vet_annual + savings.death_annual + savings.feed_efficiency + savings.insurance + savings.breeding_annual;
  const net5yr = totalSavings5yr + rancher_5yr - cc.total;

  return (
    <div ref={containerRef} className="h-[400vh] relative">
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col bg-paper border-y border-rule/50 overflow-hidden">
        {/* Header / Navigation */}
        <div className="border-b border-rule/50 p-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg/30 shrink-0">
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-ink mb-1 leading-tight">
              Biological Asset Economics — 500 Head Model
            </h3>
            <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em]">
              From Operational Expense to Yield Generation
            </p>
          </div>
          <div className="flex bg-rule/30 p-1 overflow-x-auto hide-scrollbar border border-rule/50 shrink-0">
            {views.map((v, i) => (
              <button
                key={v}
                onClick={() => {
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    const height = rect.height;
                    const targetScroll = top + (height * (i / 4)) + 10;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className={cn(
                  "px-4 py-2 text-[9px] font-bold tracking-[0.15em] uppercase transition-all whitespace-nowrap cursor-pointer",
                  view === v ? "bg-ink text-white shadow-sm border border-ink" : "text-muted hover:text-ink border border-transparent bg-paper/50"
                )}
              >
                {v === 'costs' ? 'Cost vs Alpha' : v === 'data' ? 'Data Yield' : v === 'vet' ? 'Risk Mitigation' : 'LTV Model'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 bg-paper min-h-0 flex flex-col">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {view === 'costs' && (
                  <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule/50 border border-rule/50 shrink-0">
                      <MetricCard label="Deployment Cost (5yr)" value={cc.total} isCurrency sub="$75 device + $50/yr · Zero Infra" />
                      <MetricCard label="Operational Alpha (5yr)" value={totalSavings5yr} isCurrency sub="Vet + Mortality + Feed + Insurance" accent="accent" />
                      <MetricCard label="Data Equity Share (5yr)" value={rancher_5yr} isCurrency sub="50/50 Royalty Split · Perpetual" accent="brand" />
                      <MetricCard label="Net Asset Appreciation (5yr)" value={net5yr} isCurrency sub="Post-cost capital efficiency" accent="brand" />
                    </div>
                    <div className="flex-1 w-full border border-rule/50 p-4 md:p-8 bg-bg/30 relative flex flex-col min-h-0">
                      <div className="mb-4 flex justify-between items-end shrink-0">
                        <div className="micro-label">5-Year Value Distribution</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest">Model: 500 Head</div>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Deployment Cost', val: -cc.total, color: '#0D4A2F' },
                              { name: 'Vet Optimization', val: savings.vet_annual, color: '#2D9E75' },
                              { name: 'Mortality Prevention', val: savings.death_annual, color: '#2D9E75' },
                              { name: 'Efficiency Alpha', val: savings.feed_efficiency + savings.insurance, color: '#2D9E75' },
                              { name: 'Genetic Breeding', val: savings.breeding_annual, color: '#8E8E8A' },
                              { name: 'Data Royalty (50%)', val: rancher_5yr, color: '#2D9E75' }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E2" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8E8E8A' }} angle={-30} textAnchor="end" height={60} interval={0} />
                            <YAxis tick={{ fontSize: 10, fill: '#8E8E8A' }} tickFormatter={(v) => (v < 0 ? '-$' : '$') + Math.abs(v / 1000).toFixed(0) + 'K'} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#151619', border: 'none', borderRadius: '0px', color: '#fff', padding: '12px' }}
                              itemStyle={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                              formatter={(v: number) => [fmt(Math.abs(v)), v < 0 ? 'CAPEX' : 'VALUE']}
                            />
                            <Bar dataKey="val" radius={[0, 0, 0, 0]}>
                              {(['Deployment Cost', 'Vet Optimization', 'Mortality Prevention', 'Efficiency Alpha', 'Genetic Breeding', 'Data Royalty (50%)']).map((_, index) => (
                                <Cell key={`cell-${index}`} fill={['#0D4A2F', '#2D9E75', '#2D9E75', '#2D9E75', '#8E8E8A', '#2D9E75'][index]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {view === 'data' && (
                  <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule/50 border border-rule/50 shrink-0">
                      <MetricCard label="Gross Data Yield/head/yr" value={data_rev.total_per_head_yr} isCurrency sub="Genomic + Pharma + Actuarial" />
                      <MetricCard label="Operator Royalty/head/yr" value={data_rev.total_per_head_yr * 0.5} isCurrency sub="Contractually Locked" accent="brand" />
                      <MetricCard label="Annual Passive Yield" value={rancher_annual} isCurrency sub="500 Head · Non-dilutive" accent="brand" />
                      <MetricCard label="Legacy Tech Yield" value={0} isCurrency sub="Halter/Allflex: 0% Split" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule/50 border border-rule/50 shrink-0">
                      <div className="bg-bg/30 p-4 md:p-6 flex flex-col justify-center">
                        <h4 className="font-serif text-xl md:text-2xl text-ink mb-2">The Motion Intelligence Moat</h4>
                        <p className="text-xs md:text-sm text-muted leading-relaxed font-light">
                          5,000 animals with sub-cm precision wearables generating 156-node body mapping creates a richer motion intelligence dataset than GPS-only legacy systems. Precision beats volume.
                        </p>
                      </div>
                      <div className="bg-bg/30 p-4 md:p-6 flex flex-col justify-center">
                        <h4 className="font-serif text-xl md:text-2xl text-ink mb-2">Institutional Data Buyers</h4>
                        <p className="text-xs md:text-sm text-muted leading-relaxed font-light">
                          Pharmaceutical entities ($28/head/yr). Insurance underwriters ($18/head/yr). Academic institutions ($22/head/yr). Agribusiness supply chains ($35/head/yr) for premium certification.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 border border-rule/50 bg-bg/30 flex flex-col min-h-0">
                      <div className="flex-1 overflow-auto hide-scrollbar">
                        <table className="w-full text-left text-[12px] border-collapse min-w-[800px]">
                          <thead className="sticky top-0 bg-paper z-10 shadow-sm">
                            <tr className="border-b border-rule/50">
                              <th className="py-3 px-4 font-bold micro-label text-muted">Data Stream</th>
                              <th className="py-3 px-4 font-bold micro-label text-muted">Buyer Category</th>
                              <th className="py-3 px-4 font-bold micro-label text-muted">Gross Value/yr</th>
                              <th className="py-3 px-4 font-bold micro-label text-muted">Operator 50%</th>
                              <th className="py-3 px-4 font-bold micro-label text-muted">Market Standard</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rule/50">
                            {[
                              { label: "Genomic + Biometric Signatures", buyer: "Pharma / Genomics", val: 28 },
                              { label: "Movement Intelligence Patterns", buyer: "Supply Chain / ESG", val: 35 },
                              { label: "Health Event + Disease Data", buyer: "Insurance / Actuarial", val: 18 },
                              { label: "Behavioral + Reproductive Data", buyer: "Research Institutions", val: 22 }
                            ].map((d, i) => (
                              <tr key={i} className="hover:bg-paper transition-colors">
                                <td className="py-3 px-4 font-medium text-ink">{d.label}</td>
                                <td className="py-3 px-4 text-muted font-light">{d.buyer}</td>
                                <td className="py-3 px-4 text-muted font-light">${d.val}</td>
                                <td className="py-3 px-4 font-medium text-brand">${d.val * 0.5}</td>
                                <td className="py-3 px-4">
                                  <span className="bg-ink text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 border border-ink">0% Split</span>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-brand/5 border-t-2 border-brand/20">
                              <td className="py-4 px-4 font-bold text-brand text-sm">Total Yield per Head</td>
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4 font-bold text-brand text-sm">$103</td>
                              <td className="py-4 px-4 font-bold text-brand text-sm">$51.50</td>
                              <td className="py-4 px-4">
                                <span className="bg-brand text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 border border-brand">CacheCow Only</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {view === 'vet' && (
                  <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule/50 border border-rule/50 shrink-0">
                      <MetricCard label="Legacy Vet Expense (500 head)" value={125 * HEAD} isCurrency sub="~$125/head industry average" />
                      <MetricCard label="Optimized Vet Expense" value={50 * HEAD} isCurrency sub="~$50/head via early detection" accent="brand" />
                      <MetricCard label="Annual Operational Alpha" value={75 * HEAD} isCurrency sub="Predictive vs Reactive Medicine" accent="brand" />
                      <MetricCard label="Outbreak Mitigation (1 event)" value={2000 * (HEAD * 0.05)} isCurrency sub="5% herd exposed · $2,000/animal" accent="accent" />
                    </div>
                    <div className="flex-1 w-full border border-rule/50 p-4 md:p-8 bg-bg/30 relative flex flex-col min-h-0">
                      <div className="mb-4 flex justify-between items-end shrink-0">
                        <div className="micro-label">Risk Mitigation Impact</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest">Model: 500 Head</div>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Vet Bills (Legacy)', val: 125 * HEAD, color: '#4A4A48' },
                              { name: 'Vet Bills (Optimized)', val: 50 * HEAD, color: '#2D9E75' },
                              { name: 'Mortality (Legacy)', val: HEAD * 0.03 * 2400, color: '#4A4A48' },
                              { name: 'Mortality (Optimized)', val: HEAD * 0.01 * 2400, color: '#2D9E75' },
                              { name: 'Outbreak Mitigation', val: 2000 * (HEAD * 0.05), color: '#2D9E75' }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E2" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8E8E8A' }} angle={-30} textAnchor="end" height={60} interval={0} />
                            <YAxis tick={{ fontSize: 10, fill: '#8E8E8A' }} tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'K'} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#151619', border: 'none', borderRadius: '0px', color: '#fff', padding: '12px' }}
                              itemStyle={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                              formatter={(v: number) => [fmt(v), 'VALUE']}
                            />
                            <Bar dataKey="val" radius={[0, 0, 0, 0]}>
                              {(['Vet Bills (Legacy)', 'Vet Bills (Optimized)', 'Mortality (Legacy)', 'Mortality (Optimized)', 'Outbreak Mitigation']).map((_, index) => (
                                <Cell key={`cell-${index}`} fill={['#4A4A48', '#2D9E75', '#4A4A48', '#2D9E75', '#2D9E75'][index]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {view === 'full' && (
                  <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule/50 border border-rule/50 shrink-0">
                      <MetricCard label="Total Deployment CAPEX (5yr)" value={cc.total} isCurrency sub="Hardware + Subscription" />
                      <MetricCard label="Cumulative Value Yield (5yr)" value={totalSavings5yr + rancher_5yr + savings.outbreak_prevention} isCurrency sub="Savings + Data Royalties" accent="brand" />
                      <MetricCard label="Net LTV Gain (5yr)" value={totalSavings5yr + rancher_5yr + savings.outbreak_prevention - cc.total} isCurrency sub="Post-cost capital gain" accent="brand" />
                      <MetricCard label="Yield Multiplier" value={((totalSavings5yr + rancher_5yr + savings.outbreak_prevention) / cc.total)} suffix="x" sub="Return on technology spend" accent="accent" />
                    </div>
                    <div className="flex-1 border border-rule/50 bg-bg/30 flex flex-col min-h-0">
                      <div className="flex-1 overflow-auto hide-scrollbar">
                        <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
                          <thead className="sticky top-0 bg-paper z-10 shadow-sm">
                            <tr className="border-b border-rule/50">
                              <th className="py-4 px-6 font-bold micro-label text-muted">Value Stream</th>
                              <th className="py-4 px-6 font-bold micro-label text-muted">Annual (500 head)</th>
                              <th className="py-4 px-6 font-bold micro-label text-muted">5-yr Cumulative</th>
                              <th className="py-4 px-6 font-bold micro-label text-muted">Classification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rule/50">
                            {[
                              { label: "Veterinary OPEX Reduction", annual: savings.vet_reduction, total: savings.vet_annual, type: "operational" },
                              { label: "Mortality Risk Mitigation", annual: savings.death_prevention, total: savings.death_annual, type: "operational" },
                              { label: "Genetic Breeding Optimization", annual: savings.breeding_dairy, total: savings.breeding_annual, type: "operational" },
                              { label: "Feed Efficiency + Insurance Alpha", annual: (savings.feed_efficiency + savings.insurance) / 5, total: savings.feed_efficiency + savings.insurance, type: "operational" },
                              { label: "Systemic Outbreak Prevention", annual: 0, total: savings.outbreak_prevention, type: "risk mitigation" },
                              { label: "Data Revenue Royalty (50/50)", annual: rancher_annual, total: rancher_5yr, type: "passive yield" }
                            ].map((d, i) => (
                              <tr key={i} className="hover:bg-paper transition-colors">
                                <td className="py-4 px-6 font-medium text-ink">{d.label}</td>
                                <td className="py-4 px-6 text-muted font-light">{d.annual > 0 ? fmt(d.annual) : '—'}</td>
                                <td className="py-4 px-6 text-ink font-medium">{fmt(d.total)}</td>
                                <td className="py-4 px-6">
                                  <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 border",
                                    d.type === 'operational' ? "bg-accent/10 text-accent border-accent/20" :
                                    d.type === 'risk mitigation' ? "bg-brand/10 text-brand border-brand/20" :
                                    "bg-ink text-white border-ink"
                                  )}>
                                    {d.type}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-ink/5 border-t-2 border-ink/10">
                              <td className="py-5 px-6 font-medium text-ink">CacheCow CAPEX</td>
                              <td className="py-5 px-6 text-ink font-light">{fmt(cc.total / 5)}/yr</td>
                              <td className="py-5 px-6 font-bold text-ink">({fmt(cc.total)})</td>
                              <td className="py-5 px-6"></td>
                            </tr>
                            <tr className="bg-brand/5 border-t-2 border-brand/20">
                              <td className="py-6 px-6 font-bold text-brand text-xl">Net Asset Position (5yr)</td>
                              <td className="py-6 px-6"></td>
                              <td className="py-6 px-6 font-bold text-brand text-xl">{fmt(totalSavings5yr + rancher_5yr + savings.outbreak_prevention - cc.total)}</td>
                              <td className="py-6 px-6">
                                <span className="bg-brand text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 border border-brand">Net Positive Year 1</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ 
  label, 
  value, 
  sub, 
  accent, 
  isCurrency = false,
  prefix = "",
  suffix = ""
}: { 
  label: string; 
  value: number | string; 
  sub: string; 
  accent?: 'brand' | 'accent';
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
}) => (
  <div className={cn(
    "p-4 md:p-6 transition-all bg-paper flex flex-col justify-center",
    accent === 'brand' ? "hover:bg-brand/5" :
    accent === 'accent' ? "hover:bg-accent/5" :
    "hover:bg-bg/50"
  )}>
    <div className={cn(
      "micro-label mb-2",
      accent === 'brand' ? "text-brand" :
      accent === 'accent' ? "text-accent" :
      "text-muted"
    )}>{label}</div>
    <div className={cn(
      "text-3xl md:text-4xl font-serif font-normal mb-2 tracking-tight",
      accent === 'brand' ? "text-brand" :
      accent === 'accent' ? "text-accent" :
      "text-ink"
    )}>
      {typeof value === 'number' ? (
        <Counter 
          value={value} 
          isCurrency={isCurrency} 
          prefix={prefix} 
          suffix={suffix} 
        />
      ) : (
        value
      )}
    </div>
    <div className="text-xs text-muted font-light leading-relaxed">{sub}</div>
  </div>
);
