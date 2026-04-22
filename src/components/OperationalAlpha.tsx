import React from 'react';
import { motion } from 'motion/react';
import { Reveal, Counter } from './Layout';
import { cn } from '../lib/utils';
import { TrendingUp, ShieldAlert, Heart, DollarSign } from 'lucide-react';

const alphaShifts = [
  {
    id: "01",
    title: "Veterinary OPEX Reduction",
    desc: "Bio-magnetic sensing detects physiological stress 24–72 hours before visible clinical signs. Emergency calls become scheduled interventions.",
    val: 37500,
    suffix: " saved/yr",
    sub: "500-head operation",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50/50"
  },
  {
    id: "02",
    title: "Mortality Risk Mitigation",
    desc: "A 2–4% annual mortality rate has been accepted as the cost of doing business. 24/7 health trajectory monitoring catches the drift before it becomes a crash.",
    val: 24000,
    suffix: " saved/yr",
    sub: "at $2,400/animal",
    icon: ShieldAlert,
    color: "text-amber-500",
    bg: "bg-amber-50/50"
  },
  {
    id: "03",
    title: "Genetic Breeding Optimization",
    desc: "Bio-magnetic cycling signatures raise estrus detection from 50–60% to 95%+. Every missed heat cycle costs $300–500 in lost conception.",
    val: 150000,
    suffix: " recovered/yr",
    sub: "dairy operation",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50/50"
  },
  {
    id: "04",
    title: "Data Royalty Yield",
    desc: "The asset owner owns their data. CacheCow licenses it to pharmaceutical companies and insurers. The 50/50 revenue split is permanent.",
    val: 25750,
    suffix: "/yr",
    sub: "500 animals · passive income",
    icon: DollarSign,
    color: "text-blue-500",
    bg: "bg-blue-50/50"
  }
];

export const OperationalAlpha = () => {
  return (
    <div className="my-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-rule/60">
        {alphaShifts.map((shift, i) => (
          <div 
            key={shift.id} 
            className={cn(
              "group relative p-12 border-b border-rule/60 transition-all duration-700 overflow-hidden",
              i % 2 === 0 ? "lg:border-r" : ""
            )}
          >
            {/* Background Accent */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10",
              shift.bg
            )} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted/40 font-bold tracking-widest">{shift.id}</span>
                  <div className="h-px w-8 bg-rule/60" />
                  <shift.icon className={cn("w-5 h-5", shift.color)} />
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-muted/40 group-hover:text-brand transition-colors">
                  Operational Shift
                </div>
              </div>

              <h4 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-6 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                {shift.title}
              </h4>
              
              <p className="text-lg text-muted font-light leading-relaxed mb-12 max-w-lg">
                {shift.desc}
              </p>

              <div className="flex flex-col gap-2">
                <div className={cn("text-5xl md:text-6xl font-serif font-bold tracking-tighter", shift.color)}>
                  <Counter value={shift.val} isCurrency suffix={shift.suffix} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-rule" />
                  <span className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">
                    {shift.sub}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Corner Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rule/5 to-transparent -z-10 group-hover:from-rule/20 transition-all duration-700" />
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-16 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-paper border border-rule/60 rounded-full shadow-sm">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-paper bg-rule/20" />
              ))}
            </div>
            <p className="text-sm font-medium text-ink">
              Total potential annual alpha: <span className="text-brand font-bold font-serif text-lg ml-2">$237,250+</span>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
