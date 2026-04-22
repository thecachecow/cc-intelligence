import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SectionHeader, Reveal } from './Layout';
import { cn } from '../lib/utils';
import { Mic, MessageSquare, Brain, Activity, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    num: "Stage 1",
    title: "Causal Health Inference",
    icon: Brain,
    lead: "Your ForcedField platform is already generating these health probability scores through:",
    points: [
      { label: "Point cloud analysis", sub: "gait, posture, movement patterns" },
      { label: "Bioelectric signals", sub: "via HBC protocols" },
      { label: "Environmental context", sub: "location, herd dynamics, feeding behavior" }
    ],
    footer: "The 60% probability that Bessie #347 might be sick represents a compressed causal model—your system has detected deviation patterns that correlate with pre-clinical illness states.",
    bg: "bg-[#F3EFE6]"
  },
  {
    num: "Stage 2",
    title: "Narrative Construction",
    icon: MessageSquare,
    lead: "Before Audio LFM generates speech, you need a semantic translation layer that converts:",
    raw: 'Raw: "Cow #347: Mastitis probability 0.63, based on temperature variance +1.2°C, gait asymmetry 0.41, reduced feeding duration -18%"',
    narrative: 'Narrative: "Hey boss, this is Bessie, #347. I\'m not feeling quite right today. My front left quarter feels warm and I haven\'t been eating as much. Might want to check me out."',
    footer: "This translation is critical because it contextualizes technical data, prioritizes actionable information, and personalizes the animal.",
    bg: "bg-[#E5DFD3]"
  },
  {
    num: "Stage 3",
    title: "Voice Synthesis & Dialogue",
    icon: Mic,
    lead: "Liquid AI's Audio LFM excels here because it's designed for long-form coherence and contextual consistency:",
    points: [
      { label: "Generate voice characteristics", sub: "unique to each cow (Bessie sounds different from Daisy)" },
      { label: "Maintain conversational state", sub: "across multi-turn dialogue" },
      { label: "Adapt tone based on urgency", sub: "60% concern vs. 95% emergency" }
    ],
    bg: "bg-[#D1C8B8]"
  }
];

export const BessieCallProcess = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean);
      if (panels.length < 2) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          scrub: 1,
          pin: true,
        }
      });

      panels.forEach((panel, i) => {
        if (i === 0) return; // Skip first panel as it's already visible

        const prevPanel = panels[i - 1];

        tl.to(prevPanel, {
          y: "-30vh",
          scale: 0.8,
          opacity: 0.4,
          ease: "power2.inOut"
        }, i - 1)
        .to(panel, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut"
        }, i - 1);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[100vh] w-full overflow-hidden bg-bg">
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        return (
          <div 
            key={i} 
            ref={el => panelsRef.current[i] = el}
            className={cn(
              "absolute inset-0 w-full h-full flex items-center justify-center px-6 md:px-16 overflow-y-auto",
              stage.bg
            )}
            style={{
              zIndex: i,
              clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
              willChange: 'transform, opacity, clip-path'
            }}
          >
            <div className="max-w-7xl w-full mx-auto py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Rail: Stage Info */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-[1px] bg-accent" />
                    <span className="micro-label text-accent">{stage.num}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-6 leading-tight">
                    {stage.title}
                  </h3>
                  <p className="text-lg text-muted font-light leading-relaxed mb-8">
                    {stage.lead}
                  </p>
                  {stage.footer && (
                    <div className="p-6 bg-white/40 border border-rule/50 rounded-lg text-sm text-ink/80 italic font-serif leading-relaxed">
                      {stage.footer}
                    </div>
                  )}
                </div>

                {/* Right Content: Technical Detail */}
                <div className="lg:col-span-7">
                  <div className="bg-brand text-white p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden group">
                    {/* Decorative Icon Background */}
                    <Icon className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative z-10">
                      {stage.points && (
                        <div className="grid grid-cols-1 gap-8">
                          {stage.points.map((point, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                              <div>
                                <div className="text-xl font-serif font-bold mb-1">{point.label}</div>
                                <div className="text-white/50 font-light italic">{point.sub}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {stage.raw && (
                        <div className="space-y-8">
                          <div className="p-6 bg-black/20 rounded-lg border border-white/5 font-mono text-sm leading-relaxed text-accent/80">
                            {stage.raw}
                          </div>
                          <div className="flex justify-center">
                            <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
                          </div>
                          <div className="p-8 bg-white/5 rounded-lg border border-white/10 italic font-serif text-xl md:text-2xl leading-relaxed text-white/90">
                            {stage.narrative}
                          </div>
                        </div>
                      )}

                      {i === 2 && (
                        <div className="mt-12 flex flex-col items-center gap-6">
                          <div className="w-full h-24 bg-black/20 rounded-xl flex items-center justify-center gap-1 p-4">
                            {[...Array(40)].map((_, idx) => (
                              <motion.div
                                key={idx}
                                animate={{
                                  height: [20, Math.random() * 60 + 20, 20],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: idx * 0.05,
                                }}
                                className="w-1 bg-accent/40 rounded-full"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-accent font-bold tracking-widest uppercase text-[10px]">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Live Synthesis Active
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
