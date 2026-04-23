import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal, Section } from './Layout';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'motion/react';
import { cn } from '@/src/lib/utils';

const articles = [
  {
    pub: "Bloomberg",
    title: "Halter Raises $220M in Series E — Founders Fund leads $2B valuation round",
    sub: "March 24, 2026 · The category is validated. The floor is set.",
    url: "https://bloomberg.com/news/articles/2026-03-20/peter-thiel-s-founders-fund-backs-ai-cow-collar-startup-at-2-billion-valuation",
    image: "/article-1.webp",
    logo: "/bloomberg.png"
  },
  {
    pub: "The New York Times",
    title: "Cows Wear High-Tech Collars Now",
    sub: "October 5, 2025 · The wearables help dairy farmers gather more data so their animals are happier and produce more milk.",
    url: "https://www.nytimes.com/2025/10/05/technology/cows-ai-collars.html",
    image: "/article-2.webp",
    logo: "/newyorktimes.png"
  },
  {
    pub: "Offrange",
    title: "How Will Tech Help Identify Cattle Disease Earlier?",
    sub: "April 27, 2025 · \"Maybe the next pitch we hear will move the ball down the field.\"",
    url: "https://ambrook.com/offrange/livestock/scouting-cattle-disease-on-the-feedlot",
    image: "/article-3.png",
    logo: "/offrange.png"
  },
  {
    pub: "SciTechDaily",
    title: "Groundbreaking \"Dairy Farm of the Future\" Provides Cows the Freedom of Choice",
    sub: "November 18, 2025 · Sensor tech, automated milking, real-time health data. The future they're describing — we built it.",
    url: "https://scitechdaily.com/groundbreaking-dairy-farm-of-the-future-provides-cows-the-freedom-of-choice/",
    image: "/article-4.webp",
    logo: "/scitechdaily.png"
  }
];

const ArticleImage = ({ 
  article, 
  index, 
  scrollYProgress, 
  activeIndex 
}: { 
  article: typeof articles[0], 
  index: number, 
  scrollYProgress: MotionValue<number>, 
  activeIndex: number 
}) => {
  const scaleStart = index * 0.25;
  const scaleEnd = (index + 1) * 0.25;
  const scale = useTransform(
    scrollYProgress,
    [scaleStart, scaleEnd],
    [1, 1.15]
  );

  return (
    <motion.div
      className="absolute inset-0 w-full h-full origin-center"
      initial={false}
      animate={{ opacity: activeIndex >= index ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ scale, zIndex: index }}
    >
      <img 
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

const tickerText = "THE CATEGORY IS VALIDATED · THE FLOOR IS SET · THE WINDOW IS CLOSING · THE ARCHITECTURE IS EVERYTHING · ".repeat(10);

const MarqueeStyles = () => (
  <style>{`
    @keyframes marquee-left {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes marquee-right {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0%); }
    }
    .animate-marquee-left {
      animation: marquee-left linear infinite;
    }
    .animate-marquee-right {
      animation: marquee-right linear infinite;
    }
    .pause-on-hover:hover .animate-marquee-left,
    .pause-on-hover:hover .animate-marquee-right {
      animation-play-state: paused;
    }
  `}</style>
);

const TickerLine = ({ 
  text, 
  direction = 1, 
  speed = 40,
  className 
}: { 
  text: string, 
  direction?: number, 
  speed?: number,
  className?: string 
}) => {
  return (
    <div className={cn("flex whitespace-nowrap overflow-hidden py-3 md:py-5 pause-on-hover cursor-default", className)}>
      <div
        className={cn(
          "flex whitespace-nowrap",
          direction === 1 ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="text-4xl md:text-7xl font-black tracking-tight uppercase px-4">{text}</span>
        <span className="text-4xl md:text-7xl font-black tracking-tight uppercase px-4">{text}</span>
      </div>
    </div>
  );
};

export const ThePattern = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveIndex(0);
    else if (latest < 0.5) setActiveIndex(1);
    else if (latest < 0.75) setActiveIndex(2);
    else setActiveIndex(3);
  });

  return (
    <>
      <MarqueeStyles />
      <Section id="pattern" className="bg-[#F2EFE9] border-t border-rule pb-0 md:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C4A47C] mb-6 block">The Pattern</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ink leading-tight mb-12">
                You've seen this before. <em className="font-light italic">You know which side you want to be on.</em>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="mb-12">
                <p className="text-xl md:text-2xl font-serif italic text-ink leading-relaxed font-light mb-4">
                  "Livestock is a $2.5 trillion asset class managed with the same information infrastructure it had thirty years ago. The first platform to deliver continuous, per-animal biological data will own the pricing layer for insurance, genetics, and veterinary medicine simultaneously."
                </p>
                <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted">
                  — [INVESTOR / ANALYST NAME] · [FUND / PUBLICATION] · [YEAR]
                </div>
              </div>

              <div className="space-y-6 text-ink/70 font-light leading-relaxed">
                <p>
                  MySpace proved people wanted to live online. Facebook built the place they actually lived. One was the proof of concept. One was the application that worked. <strong className="font-medium text-ink">The category was identical. The architecture was everything.</strong>
                </p>
                <p>
                  Peter Thiel just led a $220M round valuing the behavioral layer at $2 billion. The New York Times covered it. Merck monitors 2 million dairy cows globally and is already in the room. Silicon Valley is paying attention. <strong className="font-medium text-ink">The window between "we built it" and "the market knows we built it" is exactly as wide as it is right now.</strong>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Fixed Scrollbox Section */}
      <div ref={containerRef} className="h-[600vh] bg-[#F2EFE9] relative -mt-12 md:-mt-24">
        <div className="sticky top-0 h-screen flex flex-col pt-20 md:pt-24 lg:pt-32 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              
              {/* Left: Articles List */}
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
                <div className="border-t border-ink/10 relative z-10">
                  {articles.map((article, i) => (
                    <a 
                      key={i} 
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-4 p-6 border-b border-ink/10 transition-all duration-500 no-underline",
                        activeIndex === i ? "bg-ink/5 opacity-100" : "opacity-40 hover:opacity-70"
                      )}
                    >
                      <div className="flex-grow">
                        <span className="block text-[9px] font-bold tracking-[0.16em] uppercase text-[#C4A47C] mb-1.5">
                          {article.pub}
                        </span>
                        <h4 className="text-sm font-medium text-ink mb-1 group-hover:text-accent transition-colors">
                          {article.title}
                        </h4>
                        <span className="block text-[9px] font-bold tracking-[0.16em] uppercase text-muted/50">
                          {article.sub}
                        </span>
                      </div>
                      <div className="shrink-0 text-muted/30 group-hover:text-accent transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: Images */}
              <div className="lg:col-span-6 relative order-1 lg:order-2 mb-8 lg:mb-0 flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-ink/5 mb-10 lg:mb-12">
                  {articles.map((article, i) => (
                    <ArticleImage 
                      key={i} 
                      article={article} 
                      index={i} 
                      scrollYProgress={scrollYProgress} 
                      activeIndex={activeIndex} 
                    />
                  ))}
                </div>
                
                {/* Logos */}
                <div className="relative h-12 w-full flex items-center justify-center">
                  {articles.map((article, i) => (
                    <motion.img
                      key={`logo-${i}`}
                      src={article.logo}
                      alt={`${article.pub} logo`}
                      className="absolute h-8 md:h-10 object-contain max-w-[200px]"
                      initial={false}
                      animate={{ 
                        opacity: activeIndex === i ? 1 : 0, 
                        y: activeIndex === i ? 0 : 10,
                        scale: activeIndex === i ? 1 : 0.95
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Double Ticker Tape */}
          <div className="absolute -bottom-4 md:bottom-4 left-1/2 -translate-x-1/2 w-[120vw] select-none flex items-center justify-center h-48 md:h-64 z-20">
            <TickerLine 
              text={tickerText} 
              direction={-1} 
              speed={180}
              className="bg-[#C4A47C] text-[#2A2015] rotate-2 w-full absolute shadow-2xl"
            />
            <TickerLine 
              text={tickerText} 
              direction={1} 
              speed={150}
              className="bg-[#2A2015] text-[#F2EFE9] -rotate-3 w-full absolute shadow-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};
