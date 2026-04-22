import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/src/lib/utils';
import { motion, useSpring, useTransform, animate } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  value: number | string;
  duration?: number;
  className?: string;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
}

export const Counter = ({ 
  value, 
  duration = 1.2, 
  className,
  isCurrency = false,
  prefix = '',
  suffix = ''
}: CounterProps) => {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const prevValueRef = useRef<number>(0);

  // Extract numeric part if value is a string
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const initialPrefix = typeof value === 'string' ? value.match(/^[^0-9.]+/)?.[0] || '' : '';
  const initialSuffix = typeof value === 'string' ? value.match(/[0-9.]+(.+)$/)?.[1] || '' : '';

  const finalPrefix = prefix || (isCurrency ? '$' : initialPrefix);
  const finalSuffix = suffix || initialSuffix;

  useEffect(() => {
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(prevValueRef.current, numericValue, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        const formatted = latest.toLocaleString(undefined, {
          minimumFractionDigits: numericValue % 1 === 0 ? 0 : 1,
          maximumFractionDigits: 1,
        });
        setDisplayValue(`${finalPrefix}${formatted}${finalSuffix}`);
      },
    });

    prevValueRef.current = numericValue;
    return () => controls.stop();
  }, [numericValue, finalPrefix, finalSuffix, value, duration]);

  return <span className={className}>{displayValue}</span>;
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={cn("reveal will-change-transform", className)}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
};

export const Parallax = ({ children, className, speed = 0.5 }: { children?: React.ReactNode; className?: string; speed?: number }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: -100 * speed,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export const Section = ({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) => (
  <section id={id} className={cn("py-24 md:py-32 border-t border-rule first:border-t-0 px-6 md:px-16", className)}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

export const SectionHeader = ({ num, title, lead, className }: { num: string; title: string; lead?: string; className?: string }) => (
  <div className={cn("mb-16", className)}>
    <Reveal>
      <span className="micro-label mb-6 block">
        {num}
      </span>
    </Reveal>
    <Reveal delay={0.1}>
      <h2 className="text-5xl md:text-7xl font-bold text-ink leading-[0.95] mb-10">
        {title}
      </h2>
    </Reveal>
    {lead && (
      <Reveal delay={0.2}>
        <p className="text-xl md:text-2xl font-light text-mid leading-relaxed max-w-3xl">
          {lead}
        </p>
      </Reveal>
    )}
  </div>
);
