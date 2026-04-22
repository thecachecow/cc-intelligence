import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { Counter } from './Layout';

const HEAD = 500;
const YRS = 5;

const providers = [
  {
    name: "CacheCow", isCC: true, color: "#2D9E75",
    dairy: { hw: 75, sub: 50, infra: 0, note: "$75 device + $50/yr", roiMult: 1.18, roiDriver: "Motion AI + health monitoring" },
    beef:  { hw: 75, sub: 50, infra: 0, note: "$75 device + $50/yr", roiMult: 1.18, roiDriver: "Motion AI + health monitoring" }
  },
  {
    name: "Halter", isCC: false, color: "#4A4A48",
    dairy: { hw: 0, sub: 150, infra: 13800, note: "Sub-only · 4 solar towers", roiMult: 1.13, roiDriver: "Virtual fencing + heat detection" },
    beef:  { hw: 0, sub: 84,  infra: 13800, note: "Sub-only · 4 solar towers", roiMult: 1.13, roiDriver: "Virtual fencing + grazing shifts" }
  },
  {
    name: "Allflex / SenseHub", isCC: false, color: "#8E8E8A",
    dairy: { hw: 150, sub: 200, infra: 10000, note: "Collar + annual sub", roiMult: 1.06, roiDriver: "Estrus + health alerts" },
    beef:  { hw: 50,  sub: 96,  infra: 10000, note: "Ear tag + annual sub", roiMult: 1.06, roiDriver: "Location + health alerts" }
  },
  {
    name: "Afimilk / SCR", isCC: false, color: "#8E8E8A",
    dairy: { hw: 0, sub: 144, infra: 15000, note: "Dairy-only SaaS", roiMult: 1.10, roiDriver: "Rumination + reproduction" },
    beef:  { hw: 0, sub: 110, infra: 15000, note: "Adapted dairy system", roiMult: 1.05, roiDriver: "Basic activity only" }
  },
  {
    name: "Nofence", isCC: false, color: "#8E8E8A",
    dairy: { hw: 0, sub: 108, infra: 2000, note: "Limited dairy use", roiMult: 1.05, roiDriver: "Virtual fencing only" },
    beef:  { hw: 0, sub: 96,  infra: 2000, note: "Beef/rangeland specialist", roiMult: 1.09, roiDriver: "Rotational grazing" }
  },
  {
    name: "Gallagher eShepherd", isCC: false, color: "#8E8E8A",
    dairy: { hw: 0, sub: 114, infra: 10000, note: "Better suited for beef", roiMult: 1.05, roiDriver: "Virtual fencing" },
    beef:  { hw: 0, sub: 114, infra: 10000, note: "Hill country proven", roiMult: 1.08, roiDriver: "Rugged terrain grazing" }
  },
  {
    name: "CowManager (Lely)", isCC: false, color: "#8E8E8A",
    dairy: { hw: 30, sub: 84, infra: 5000, note: "Budget ear tags", roiMult: 1.04, roiDriver: "Fertility + disease alerts" },
    beef:  { hw: 30, sub: 84, infra: 5000, note: "Budget ear tags", roiMult: 1.04, roiDriver: "Basic health only" }
  }
];

type HerdType = 'dairy' | 'beef';
type TabType = 'total' | 'perhead' | 'roi';

export const MarketComparison = () => {
  const [herd, setHerd] = useState<HerdType>('dairy');
  const [tab, setTab] = useState<TabType>('total');

  const data = useMemo(() => {
    return providers.map(p => {
      const d = p[herd];
      const hw = d.hw * HEAD;
      const sub = d.sub * HEAD * YRS;
      const infra = d.infra;
      const total = hw + sub + infra;
      const perHeadYr = total / HEAD / YRS;
      const perHeadMo = perHeadYr / 12;
      const roiGain = (d.roiMult - 1) * 100;
      const netValue = total * d.roiMult - total;

      return {
        ...p,
        hw,
        sub,
        infra,
        total,
        perHeadYr,
        perHeadMo,
        roiGain,
        netValue,
        note: d.note,
        roiDriver: d.roiDriver
      };
    }).sort((a, b) => {
      if (tab === 'roi') return b.roiGain - a.roiGain;
      return a.total - b.total;
    });
  }, [herd, tab]);

  const cc = data.find(d => d.isCC)!;
  const avgTotal = data.reduce((s, d) => s + d.total, 0) / data.length;

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();
  const fmtm = (n: number) => '$' + n.toFixed(2);

  return (
    <div className="editorial-card p-6 md:p-12 my-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-ink mb-2 leading-tight">
            500-head {herd} operation — 5-year comparison
          </h3>
          <p className="text-sm text-muted font-light">
            Best-in-class providers · purchase model where applicable · all figures in USD
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex bg-muted/10 p-1 rounded-full">
            {(['dairy', 'beef'] as HerdType[]).map(h => (
              <button
                key={h}
                onClick={() => setHerd(h)}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all rounded-full",
                  herd === h ? "bg-white text-brand shadow-sm" : "text-muted hover:text-brand"
                )}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="flex bg-muted/10 p-1 rounded-full">
            {(['total', 'perhead', 'roi'] as TabType[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all rounded-full",
                  tab === t ? "bg-white text-brand shadow-sm" : "text-muted hover:text-brand"
                )}
              >
                {t === 'perhead' ? 'Per Head' : t === 'roi' ? 'ROI' : 'Total Cost'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {tab === 'total' && (
          <>
            <MetricCard label="CacheCow 5-yr Total" value={cc.total} isCurrency sub={cc.note} accent="brand" />
            <MetricCard label="Market Avg 5-yr Total" value={avgTotal} isCurrency sub="7-provider average" />
            <MetricCard label="Savings vs Average" value={avgTotal - cc.total} isCurrency sub="CacheCow advantage" accent="accent" />
            <MetricCard label="Halter 5-yr Total" value={data.find(d => d.name === 'Halter')?.total || 0} isCurrency sub="Market leader comparison" />
          </>
        )}
        {tab === 'perhead' && (
          <>
            <MetricCard label="CacheCow Unit Cost" value={75} isCurrency sub="One-time purchase" accent="brand" />
            <MetricCard label="CacheCow Lease Option" value={93.75} isCurrency sub="+25% lease premium" />
            <MetricCard label="CacheCow Annual Sub" value={50} isCurrency suffix="/yr" sub="Per head, all features" accent="accent" />
            <MetricCard label="CacheCow Effective/mo" value={cc.perHeadMo} isCurrency sub="Amortized per head" />
          </>
        )}
        {tab === 'roi' && (
          <>
            <MetricCard label="CacheCow Est. ROI Gain" value={cc.roiGain} prefix="+" suffix="%" sub={cc.roiDriver} accent="brand" />
            <MetricCard label="CacheCow Value Created" value={cc.netValue} isCurrency sub={`Vs cost of ${fmt(cc.total)}`} accent="accent" />
            <MetricCard label="Market Avg ROI Gain" value={data.reduce((s, d) => s + d.roiGain, 0) / data.length} prefix="+" suffix="%" sub="7-provider average" />
            <MetricCard label="Best ROI Provider" value={data[0].name} isString sub="Highest estimated return" />
          </>
        )}
      </div>

      <div className="h-[400px] w-full mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={tab === 'perhead' ? 'vertical' : 'horizontal'}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E2" />
            {tab === 'perhead' ? (
              <>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8E8E8A' }} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#141413', fontWeight: 500 }} width={120} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8E8E8A' }} angle={-30} textAnchor="end" interval={0} height={80} />
                <YAxis tick={{ fontSize: 10, fill: '#8E8E8A' }} tickFormatter={(v) => tab === 'roi' ? `+${v}%` : `$${(v / 1000).toFixed(0)}K`} />
              </>
            )}
            <Tooltip
              contentStyle={{ backgroundColor: '#0D4A2F', border: 'none', borderRadius: '12px', color: '#fff', padding: '12px' }}
              itemStyle={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              formatter={(value: number) => tab === 'roi' ? [`+${value.toFixed(1)}%`, 'ROI Gain'] : [fmt(value), 'Value']}
            />
            {tab === 'total' ? (
              <>
                <Bar dataKey="hw" name="Hardware" stackId="a" fill="#0D4A2F" opacity={0.9} />
                <Bar dataKey="sub" name="Subscription (5yr)" stackId="a" fill="#2D9E75" opacity={0.6} />
                <Bar dataKey="infra" name="Infrastructure" stackId="a" fill="#8E8E8A" opacity={0.3} />
              </>
            ) : tab === 'perhead' ? (
              <Bar dataKey="perHeadMo" name="$/head/mo">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCC ? '#2D9E75' : '#8E8E8A'} opacity={0.8} />
                ))}
              </Bar>
            ) : (
              <Bar dataKey="roiGain" name="ROI Gain %">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCC ? '#2D9E75' : '#8E8E8A'} opacity={0.8} />
                ))}
              </Bar>
            )}
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-rule">
              <th className="py-4 font-bold micro-label text-muted">Provider</th>
              {tab === 'total' ? (
                <>
                  <th className="py-4 font-bold micro-label text-muted">Hardware</th>
                  <th className="py-4 font-bold micro-label text-muted">Sub (5yr)</th>
                  <th className="py-4 font-bold micro-label text-muted">Infra</th>
                  <th className="py-4 font-bold micro-label text-muted">Total 5yr</th>
                  <th className="py-4 font-bold micro-label text-muted">vs CacheCow</th>
                </>
              ) : tab === 'perhead' ? (
                <>
                  <th className="py-4 font-bold micro-label text-muted">Device</th>
                  <th className="py-4 font-bold micro-label text-muted">Annual Sub</th>
                  <th className="py-4 font-bold micro-label text-muted">Infra</th>
                  <th className="py-4 font-bold micro-label text-muted">$/head/yr</th>
                  <th className="py-4 font-bold micro-label text-muted">$/head/mo</th>
                </>
              ) : (
                <>
                  <th className="py-4 font-bold micro-label text-muted">Value Driver</th>
                  <th className="py-4 font-bold micro-label text-muted">Est. Gain</th>
                  <th className="py-4 font-bold micro-label text-muted">5yr Cost</th>
                  <th className="py-4 font-bold micro-label text-muted">Est. Value</th>
                </>
              )}
              <th className="py-4 font-bold micro-label text-muted text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/50">
            {data.map((d, i) => (
              <tr key={i} className={cn("hover:bg-bg/50 transition-colors", d.isCC && "bg-brand/5")}>
                <td className={cn("py-4 font-medium", d.isCC ? "text-brand" : "text-ink")}>{d.name}</td>
                {tab === 'total' ? (
                  <>
                    <td className="py-4 text-muted font-light">{fmt(d.hw)}</td>
                    <td className="py-4 text-muted font-light">{fmt(d.sub)}</td>
                    <td className="py-4 text-muted font-light">{fmt(d.infra)}</td>
                    <td className="py-4 font-medium text-ink">{fmt(d.total)}</td>
                    <td className="py-4 text-muted font-light">{d.isCC ? '—' : `${fmt(d.total - cc.total)} more`}</td>
                  </>
                ) : tab === 'perhead' ? (
                  <>
                    <td className="py-4 text-muted font-light">{d.hw > 0 ? fmt(d.hw / HEAD) : 'Included'}</td>
                    <td className="py-4 text-muted font-light">{fmt(d.sub / HEAD / YRS)}/yr</td>
                    <td className="py-4 text-muted font-light">{fmt(d.infra)}</td>
                    <td className="py-4 text-muted font-light">{fmtm(d.perHeadYr)}</td>
                    <td className="py-4 font-medium text-ink">{fmtm(d.perHeadMo)}</td>
                  </>
                ) : (
                  <>
                    <td className="py-4 text-muted font-light">{d.roiDriver}</td>
                    <td className="py-4 font-medium text-accent">+{d.roiGain.toFixed(0)}%</td>
                    <td className="py-4 text-muted font-light">{fmt(d.total)}</td>
                    <td className="py-4 font-medium text-ink">{fmt(d.netValue)}</td>
                  </>
                )}
                <td className="py-4 text-right">
                  <Badge type={d.isCC ? 'best' : d.total < cc.total * 1.5 ? 'good' : d.total < cc.total * 2.5 ? 'ok' : 'premium'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-8 text-[11px] text-muted italic leading-relaxed max-w-2xl">
        ROI estimates based on published farm studies and platform capability benchmarks. CacheCow based on movement intelligence platform projections. Actual results vary by operation.
      </p>
    </div>
  );
};

const MetricCard = ({ 
  label, 
  value, 
  sub, 
  accent, 
  isCurrency = false, 
  prefix = '', 
  suffix = '', 
  isString = false 
}: { 
  label: string; 
  value: string | number; 
  sub: string; 
  accent?: 'brand' | 'accent'; 
  isCurrency?: boolean; 
  prefix?: string; 
  suffix?: string; 
  isString?: boolean 
}) => (
  <div className={cn(
    "p-6 rounded-waabi border transition-all",
    accent === 'brand' ? "bg-brand/5 border-brand/20" :
    accent === 'accent' ? "bg-accent/5 border-accent/20" :
    "bg-bg border-rule"
  )}>
    <div className={cn(
      "micro-label mb-2",
      accent === 'brand' ? "text-brand" :
      accent === 'accent' ? "text-accent" :
      "text-muted"
    )}>{label}</div>
    <div className={cn(
      "text-3xl font-bold mb-1 tracking-tight",
      accent === 'brand' ? "text-brand" :
      accent === 'accent' ? "text-accent" :
      "text-ink"
    )}>
      {isString || typeof value !== 'number' ? (
        value
      ) : (
        <Counter 
          value={value} 
          isCurrency={isCurrency}
          prefix={prefix}
          suffix={suffix}
        />
      )}
    </div>
    <div className="text-[11px] text-muted font-light leading-tight">{sub}</div>
  </div>
);

const Badge = ({ type }: { type: 'best' | 'good' | 'ok' | 'premium' }) => {
  const styles = {
    best: "bg-brand text-white border-brand",
    good: "bg-accent/10 text-accent border-accent/20",
    ok: "bg-muted/10 text-muted border-muted/20",
    premium: "bg-ink text-white border-ink"
  };
  const labels = {
    best: "Lowest Cost",
    good: "Competitive",
    ok: "Moderate",
    premium: "Premium"
  };
  return (
    <span className={cn("text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border", styles[type])}>
      {labels[type]}
    </span>
  );
};
