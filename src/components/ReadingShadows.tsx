import React, { useRef } from 'react';
import { Reveal } from './Layout';
import { motion, useScroll, useTransform } from 'motion/react';

export const ReadingShadows = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Magnify out as we scroll down
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <section ref={containerRef} id="shadows" className="relative overflow-hidden border-t border-rule py-24 md:py-32 px-6 md:px-16 bg-[#F2EFE9]">
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-0 origin-top"
        style={{ scale }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-contain bg-no-repeat"
          style={{ 
            backgroundImage: 'url("/measure-the-shadow.png")',
            backgroundPosition: 'center -40%'
          }}
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#F2EFE9]/85 backdrop-blur-[2px]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-ink leading-tight tracking-tight">
                Every platform in this<br />
                space is reading <em className="italic font-light">shadows.</em>
              </h2>
            </Reveal>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C4A47C] mb-6 block">
                Why the data is different
              </span>
              <p className="text-lg text-ink/70 leading-relaxed font-light">
                Behavioral data is a proxy for physiology. Physiology is a proxy for health. Every inference step introduces error and caps the value of the dataset at the behavioral layer. <strong className="font-medium text-ink">The asset you want to own is one layer deeper.</strong> A behavioral dataset is a workflow tool. A physiological dataset is a clinical database. They are not priced the same way.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Diagram */}
        <Reveal delay={0.2}>
          <div className="flex flex-col md:flex-row border border-ink/10 mb-12 bg-[#F2EFE9]/60 backdrop-blur-md">
            {/* Column 1 */}
            <div className="flex-1 p-8 md:p-10">
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted mb-6 block">
                What every other platform measures
              </span>
              <h3 className="text-3xl font-serif text-ink mb-4">Behavior</h3>
              <p className="text-sm text-ink/70 leading-relaxed font-light">
                Movement, GPS, activity. What the animal did — inferred from an accelerometer. The current state of the art.
              </p>
            </div>

            {/* Separator 1 */}
            <div className="hidden md:flex items-center justify-center border-l border-r border-ink/10 px-3 bg-ink/5 relative">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C4A47C] -rotate-90 whitespace-nowrap absolute">
                Classification Error
              </span>
            </div>

            {/* Column 2 */}
            <div className="flex-1 p-8 md:p-10 border-t md:border-t-0 border-ink/10">
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted mb-6 block">
                Still inferred · Never direct
              </span>
              <h3 className="text-3xl font-serif text-ink mb-4">Physiology</h3>
              <p className="text-sm text-ink/70 leading-relaxed font-light">
                Internal state estimated from behavioral proxy. No direct biomarkers. No hormonal profile. No temperature time series.
              </p>
            </div>

            {/* Separator 2 */}
            <div className="hidden md:flex items-center justify-center border-l border-r border-ink/10 px-3 bg-ink/5 relative">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C4A47C] -rotate-90 whitespace-nowrap absolute">
                Aggregation Error
              </span>
            </div>

            {/* Column 3 */}
            <div className="flex-1 p-8 md:p-10 bg-[#E5D08F]/90 border-t md:border-t-0 border-ink/10">
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-[#A68A48] mb-6 block">
                Where CacheCow operates
              </span>
              <h3 className="text-3xl font-serif text-ink mb-4">Health</h3>
              <p className="text-sm text-ink/80 leading-relaxed font-light">
                Direct bio-magnetic measurement. Verifiable clinical state. The ground truth pharma, insurance, and commodity finance actually need.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-serif italic text-ink/60 font-light">
              One billion animals. Zero physiological records. That is the gap CacheCow closes.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
