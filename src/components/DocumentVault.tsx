import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Lock, ChevronDown, Heart, ArrowRight, Shield, FileText, BarChart3, Cpu, Globe } from 'lucide-react';
import { OperationalAlpha } from './OperationalAlpha';
import { Section, SectionHeader, Reveal } from './Layout';

export default function DocumentVault() {
  const [openCard, setOpenCard] = useState<string | null>('deck');
  const [unlockedCards, setUnlockedCards] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFlywheelPrompt, setShowFlywheelPrompt] = useState(false);
  const [flywheelInput, setFlywheelInput] = useState('');
  const [flywheelDenied, setFlywheelDenied] = useState(false);
  const [showCRT, setShowCRT] = useState(false);
  const [crtOutput, setCrtOutput] = useState<any[]>([]);
  const [showBell, setShowBell] = useState(false);

  const crtRef = useRef<HTMLDivElement>(null);
  const flywheelPromptShown = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const toggleCard = (id: string) => {
    if (unlockedCards.has(id)) return;
    setOpenCard(openCard === id ? null : id);
    if (!flywheelPromptShown.current) {
      setTimeout(() => {
        setShowFlywheelPrompt(true);
        flywheelPromptShown.current = true;
      }, 500);
    }
  };

  const handleRequestDoc = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setUnlockedCards(new Set([...unlockedCards, id]));
    // In a real app, we'd send an email here
  };

  const checkFlywheel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (flywheelInput.trim().toLowerCase() === 'forcedfield') {
        setShowFlywheelPrompt(false);
        launchCRT();
      } else {
        setFlywheelDenied(true);
        setTimeout(() => {
          setShowFlywheelPrompt(false);
          setTimeout(() => {
            setFlywheelDenied(false);
            setFlywheelInput('');
            setShowBell(true);
          }, 400);
        }, 1200);
      }
    }
  };

  const launchCRT = () => {
    setShowCRT(true);
    document.body.style.overflow = 'hidden';
    bootSequence();
  };

  const bootSequence = () => {
    const BOOT = [
      { t: 0, txt: 'ARTOFFICIAL SYSTEMS INC. © 1984', cls: 'crt-sys' },
      { t: 180, txt: 'BIOS v2.1.4 — TRIPLE FLYWHEEL ARCHITECTURE', cls: 'crt-sys' },
      { t: 360, txt: 'LOADING KNOWWARE KERNEL... OK', cls: 'crt-ok' },
      { t: 520, txt: 'LOADING FORCEDFIELD SoC DRIVER... OK', cls: 'crt-ok' },
      { t: 680, txt: 'MOUNTING CACHECOW APPLICATION LAYER... OK', cls: 'crt-ok' },
      { t: 900, txt: '', cls: '' },
      { t: 980, txt: 'CLEARANCE VERIFIED.', cls: 'crt-hi' },
      { t: 1200, txt: 'WELCOME TO THE TRIPLE FLYWHEEL.', cls: 'crt-hi' },
      { t: 1500, txt: '', cls: '' },
      { t: 1600, txt: 'YOU HAVE BEEN WATCHING A COW COLLAR COMPANY.', cls: 'crt-dim' },
      { t: 1900, txt: 'YOU HAVE NOT BEEN WATCHING A COW COLLAR COMPANY.', cls: 'crt-hi' },
      { t: 2300, txt: '', cls: '' },
      { t: 2400, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 2500, txt: 'THE TRIPLE FLYWHEEL — CLASSIFIED', cls: 'crt-title' },
      { t: 2700, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 2900, txt: '', cls: '' },
      { t: 3000, txt: 'FLYWHEEL 01 — ARTOFFICIAL', cls: 'crt-label' },
      { t: 3100, txt: '  ROLE    : Intellectual Property / Parent Entity', cls: 'crt-body' },
      { t: 3200, txt: '  FUNCTION: Generates, holds, and licenses all core IP', cls: 'crt-body' },
      { t: 3300, txt: '  MANDATE : Every downstream entity licenses from here', cls: 'crt-body' },
      { t: 3400, txt: '  STATUS  : ACTIVE — patents filing', cls: 'crt-ok' },
      { t: 3600, txt: '', cls: '' },
      { t: 3700, txt: 'FLYWHEEL 02 — KNOWWARE', cls: 'crt-label' },
      { t: 3800, txt: '  ROLE    : Applied Research / Cybernetics', cls: 'crt-body' },
      { t: 3900, txt: '  STRUCTURE: Non-profit — IP defensible and shareable', cls: 'crt-body' },
      { t: 4000, txt: '  FUNCTION: Turns Artofficial IP into applied research', cls: 'crt-body' },
      { t: 4100, txt: '  MANDATE : Licenses freely within field. Generates proof.', cls: 'crt-body' },
      { t: 4200, txt: '  STATUS  : ACTIVE — research ongoing', cls: 'crt-ok' },
      { t: 4400, txt: '', cls: '' },
      { t: 4500, txt: 'FLYWHEEL 03 — FORCEDFIELD', cls: 'crt-label' },
      { t: 4600, txt: '  ROLE    : Semiconductor / Fab / System-on-Chip', cls: 'crt-body' },
      { t: 4700, txt: '  FUNCTION: Bakes IP into silicon. Makes the chip.', cls: 'crt-body' },
      { t: 4800, txt: '  OUTPUT  : Every application runs on Forcedfield SoC', cls: 'crt-body' },
      { t: 4900, txt: '  MANDATE : Licenses to all applications in their field', cls: 'crt-body' },
      { t: 5000, txt: '  STATUS  : ACTIVE — blueprints done', cls: 'crt-ok' },
      { t: 5200, txt: '', cls: '' },
      { t: 5300, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 5400, txt: '', cls: '' },
      { t: 5500, txt: 'CACHECOW = APPLICATION 001', cls: 'crt-hi' },
      { t: 5700, txt: 'First deployment of Forcedfield SoC in the field.', cls: 'crt-body' },
      { t: 5900, txt: 'Proof that the chip works. Proof that the data is real.', cls: 'crt-body' },
      { t: 6100, txt: 'Proof that ranchers say yes.', cls: 'crt-body' },
      { t: 6400, txt: '', cls: '' },
      { t: 6500, txt: 'THE CHIP DOES NOT STAY ON THE COW.', cls: 'crt-hi' },
      { t: 6800, txt: '', cls: '' },
      { t: 6900, txt: 'Every vertical that runs on biological intelligence...', cls: 'crt-dim' },
      { t: 7100, txt: 'Every device that runs on a Forcedfield SoC...', cls: 'crt-dim' },
      { t: 7300, txt: 'Every patent that flows through Artofficial...', cls: 'crt-dim' },
      { t: 7500, txt: 'Every paper that emerges from Knowware...', cls: 'crt-dim' },
      { t: 7800, txt: '', cls: '' },
      { t: 7900, txt: 'IS LICENSED.', cls: 'crt-hi' },
      { t: 8100, txt: 'COMPOUNDS.', cls: 'crt-hi' },
      { t: 8300, txt: 'FEEDS THE FLYWHEEL.', cls: 'crt-hi' },
      { t: 8600, txt: '', cls: '' },
      { t: 8700, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 8800, txt: 'THE INVITATION', cls: 'crt-title' },
      { t: 8900, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 9100, txt: '', cls: '' },
      { t: 9200, txt: 'You are not being invited to invest in a cow collar.', cls: 'crt-body' },
      { t: 9500, txt: '', cls: '' },
      { t: 9600, txt: 'You are being invited to invest in:', cls: 'crt-body' },
      { t: 9800, txt: '  — The IP holding company (Artofficial)', cls: 'crt-item' },
      { t: 10000, txt: '  — The applied research engine (Knowware)', cls: 'crt-item' },
      { t: 10200, txt: '  — The semiconductor foundry (Forcedfield)', cls: 'crt-item' },
      { t: 10400, txt: '  — Any and all applications of the SoC', cls: 'crt-item' },
      { t: 10600, txt: '  — CacheCow and every vertical that follows', cls: 'crt-item' },
      { t: 10900, txt: '', cls: '' },
      { t: 11000, txt: 'THE FLYWHEEL IS SELF-FUNDING.', cls: 'crt-hi' },
      { t: 11200, txt: 'THE FLYWHEEL IS SELF-COMPOUNDING.', cls: 'crt-hi' },
      { t: 11400, txt: 'THE FLYWHEEL DOES NOT STOP.', cls: 'crt-hi' },
      { t: 11700, txt: '', cls: '' },
      { t: 11800, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 11900, txt: 'FORCEDFIELD SoC v1.0 — TECHNICAL SPECS', cls: 'crt-title' },
      { t: 12000, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 12200, txt: '  ARCHITECTURE: Base 9 Ternary Logic Core', cls: 'crt-body' },
      { t: 12300, txt: '  FABRICATION : 7nm Gallium Nitride (GaN)', cls: 'crt-body' },
      { t: 12400, txt: '  POWER       : 0.8μW in deep sleep / 12mW at 400Hz', cls: 'crt-body' },
      { t: 12500, txt: '  SENSORS     : Bio-magnetic / Quantum Tissue-Coupling', cls: 'crt-body' },
      { t: 12600, txt: '  NETWORK     : Herd-Mesh™ / 868MHz / 915MHz', cls: 'crt-body' },
      { t: 12800, txt: '', cls: '' },
      { t: 12900, txt: '══════════════════════════════════════════════════', cls: 'crt-rule' },
      { t: 13000, txt: '', cls: '' },
      { t: 13100, txt: '#TELLNOONE', cls: 'crt-secret' },
      { t: 13400, txt: '', cls: '' },
      { t: 13500, txt: '> TO PROCEED: CONTACT THE FOUNDERS DIRECTLY.', cls: 'crt-prompt-line' },
      { t: 13700, txt: '> REFERENCE: TRIPLE FLYWHEEL — ACCESS LEVEL 3', cls: 'crt-prompt-line' },
      { t: 14000, txt: '', cls: '' },
      { t: 14100, txt: '_ ', cls: 'crt-cursor-line' },
    ];

    BOOT.forEach(({ t, txt, cls }) => {
      setTimeout(() => {
        setCrtOutput(prev => [...prev, { txt, cls }]);
        if (crtRef.current) {
          crtRef.current.scrollTop = crtRef.current.scrollHeight;
        }
      }, t);
    });
  };

  const closeCRT = () => {
    setShowCRT(false);
    document.body.style.overflow = '';
    setCrtOutput([]);
  };

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 h-16 bg-bg/95 backdrop-blur-xl border-b border-rule">
        <Link className="font-medium text-[11px] tracking-[0.25em] uppercase no-underline hover:text-accent transition-colors" to="/investor">Cache Cow</Link>
        <div className="flex items-center gap-2">
          <Link to="/investor" className="hidden sm:block text-[10px] font-medium tracking-[0.16em] uppercase px-4 py-2 border border-transparent hover:border-rule transition-all text-muted hover:text-ink">Investor View</Link>
          {showBell && (
            <button onClick={() => setShowFlywheelPrompt(true)} className="relative bg-none border border-rule rounded-full p-2.5 text-muted hover:text-ink transition-all">
              <Heart size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border-[1.5px] border-bg"></span>
            </button>
          )}
          <Link to="/" className="text-[10px] font-medium tracking-[0.16em] uppercase px-5 py-2.5 bg-ink text-bg border border-ink hover:bg-ink/80 transition-all shadow-sm">Public Site</Link>
        </div>
      </nav>

      {/* VERIFIED BANNER */}
      <div className="mt-16 bg-brand px-6 md:px-16 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <Shield className="w-4 h-4 text-[#C4A47C]" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Document Vault</span>
            <span className="text-[10px] font-bold tracking-widest text-[#C4A47C] uppercase bg-[#C4A47C]/10 px-2 py-0.5 rounded">Institutional Access</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">NDA Active</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">Confidential</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">© 2026 CacheCow</span>
        </div>
      </div>

      {/* VAULT HEADER */}
      <div className="px-6 md:px-16 py-32 bg-bg border-b border-rule relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          <Reveal>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-8">Access Level 3</div>
            <h1 className="font-serif text-[clamp(40px,6vw,80px)] font-bold leading-[0.9] text-ink">Three documents.<br /><em className="italic text-accent">The complete picture.</em></h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl mb-10 text-muted leading-relaxed font-light">
              We operate with radical transparency for qualified partners. Request access to our full narrative, financial architecture, and technical blueprints.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'deck', num: '01', name: 'Deck', icon: FileText },
                { id: 'model', num: '02', name: 'Model', icon: BarChart3 },
                { id: 'paper', num: '03', name: 'Paper', icon: Cpu }
              ].map(doc => (
                <a 
                  key={doc.id} 
                  href={`#doc-${doc.id}`} 
                  onClick={(e) => { e.preventDefault(); toggleCard(doc.id); }} 
                  className="flex flex-col items-center p-6 border border-rule rounded-2xl hover:border-accent hover:bg-white transition-all no-underline group"
                >
                  <doc.icon className="w-6 h-6 text-muted/50 group-hover:text-accent mb-4 transition-colors" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50 group-hover:text-accent mb-1 transition-colors">{doc.num}</span>
                  <span className="text-[11px] font-bold text-ink uppercase tracking-widest">{doc.name}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* VAULT BODY */}
      <div className="px-6 md:px-16 py-20 bg-black/5">
        <div className="max-w-[1200px] mx-auto space-y-8">
          {[
            {
              id: 'deck',
              tag: 'The Deck',
              title: 'The Full Narrative',
              desc: 'Market architecture, traction, team, and the structural reason this opportunity exists now.',
              icon: FileText,
              content: (
                <div className="space-y-8">
                  <div className="p-8 bg-white border border-rule rounded-2xl shadow-sm">
                    <h3 className="font-serif text-2xl font-bold text-ink mb-4">CacheCow — Biological Asset Intelligence</h3>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-6 italic">Strategic Positioning</div>
                    <p className="text-sm leading-relaxed text-muted mb-6 font-light">
                      Someone spent $300 million proving ranchers will pay for livestock intelligence. They de-risked the category, trained the market, and established that biological data at livestock scale has institutional value. 
                      <strong className="text-ink font-medium block mt-4">We didn't have to spend that $300 million. We just had to build what comes next.</strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-rule">
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-2">The Market Floor</div>
                        <div className="font-serif text-4xl font-bold text-accent">$2,000,000,000</div>
                        <p className="text-xs text-muted/70 mt-2 font-light">Behavioral layer · 700K animals · Market validated</p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-2">The CacheCow Ceiling</div>
                        <div className="font-serif text-4xl font-bold text-brand">UNBOUNDED</div>
                        <p className="text-xs text-muted/70 mt-2 font-light">Physiological layer · Clinical grade · Global scale</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'model',
              tag: 'The Model',
              title: 'The Economics',
              desc: 'Unit economics, royalty compounding, and the path from 500 cows to 500,000.',
              icon: BarChart3,
              content: (
                <div className="space-y-8">
                  <div className="p-8 bg-white border border-rule rounded-2xl shadow-sm">
                    <h3 className="font-serif text-2xl font-bold text-ink mb-4">Financial Architecture — CacheCow</h3>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-6 italic">Unit Economics · 500-Head Baseline</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { l: 'Device BOM', v: '$75', d: 'Forcedfield SoC v1.8' },
                        { l: 'SaaS Revenue', v: '$50/yr', d: 'Per animal subscription' },
                        { l: 'Data Alpha', v: '$120/yr', d: 'Est. licensing value' }
                      ].map((m, i) => (
                        <div key={i} className="p-6 bg-bg rounded-xl border border-rule">
                          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-2">{m.l}</div>
                          <div className="font-serif text-3xl font-bold text-ink mb-1">{m.v}</div>
                          <div className="text-[10px] text-muted/70 uppercase tracking-widest">{m.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'paper',
              tag: 'The Paper',
              title: 'The Architecture',
              desc: 'Biological time-series, ternary encoding, quantum tissue-coupling, and the dual-use framework.',
              icon: Cpu,
              content: (
                <div className="space-y-8">
                  <div className="p-8 bg-white border border-rule rounded-2xl shadow-sm">
                    <h3 className="font-serif text-2xl font-bold text-ink mb-4">Technical Whitepaper — Abstract</h3>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-6 italic">Architectural Paradigm Shift</div>
                    <p className="text-sm leading-relaxed text-muted italic border-l-2 border-accent pl-6 py-2">
                      "Current livestock intelligence platforms operate on a fundamental architectural constraint: they measure behavior as a proxy for physiology, and physiology as a proxy for health. Each inference step introduces compounding error and caps the commercial value of the resulting dataset at the behavioral layer."
                    </p>
                    <p className="text-sm leading-relaxed text-muted mt-6 font-light">
                      CacheCow bypasses the behavioral layer entirely, capturing high-fidelity physiological time-series data directly at the biological source.
                    </p>
                  </div>
                </div>
              )
            }
          ].map((doc, i) => (
            <div 
              key={doc.id} 
              id={`doc-${doc.id}`} 
              className={`bg-white border border-rule rounded-3xl overflow-hidden transition-all duration-500 shadow-sm ${unlockedCards.has(doc.id) ? 'ring-2 ring-accent/20 border-accent' : ''}`}
            >
              <div 
                className={`p-8 md:p-12 cursor-pointer hover:bg-black/5 transition-colors flex flex-col md:flex-row md:items-center gap-8 ${openCard === doc.id ? 'bg-black/5' : ''}`}
                onClick={() => toggleCard(doc.id)}
              >
                <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center flex-shrink-0 border border-rule group-hover:border-accent transition-colors">
                  <doc.icon className={`w-8 h-8 ${unlockedCards.has(doc.id) ? 'text-accent' : 'text-muted/50'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Document 0{i + 1}</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50">{doc.tag}</span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-ink mb-2">{doc.title}</h2>
                  <p className="text-sm text-muted leading-relaxed max-w-[600px] font-light">{doc.desc}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${unlockedCards.has(doc.id) ? 'text-accent' : 'text-muted/70'}`}>
                    {unlockedCards.has(doc.id) ? (
                      <><Check className="w-4 h-4" /> Unlocked</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Request Access</>
                    )}
                  </div>
                  {!unlockedCards.has(doc.id) && (
                    <ChevronDown className={`w-5 h-5 text-muted/50 transition-transform duration-500 ${openCard === doc.id ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {(openCard === doc.id || unlockedCards.has(doc.id)) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-rule"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0">
                      <div className="p-8 md:p-12 bg-black/5 relative">
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50 mb-8">Preview — Section 01</div>
                        <div className="relative">
                          {doc.content}
                          {!unlockedCards.has(doc.id) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-[#F9F7F4]/80 to-transparent pointer-events-none"></div>
                          )}
                        </div>
                      </div>
                      
                      {!unlockedCards.has(doc.id) && (
                        <div className="p-8 md:p-12 bg-white border-l border-rule">
                          <form onSubmit={(e) => handleRequestDoc(doc.id, e)} className="space-y-6">
                            <div>
                              <h4 className="font-serif text-2xl font-bold text-ink mb-2">Request Access</h4>
                              <p className="text-xs text-muted leading-relaxed font-light">
                                Verified access for institutional partners. We follow up within 24 hours with your secure link.
                              </p>
                            </div>
                            <div className="space-y-4">
                              <input required className="w-full bg-bg border border-rule px-4 py-3 rounded-xl text-sm outline-none focus:border-accent transition-colors" type="text" placeholder="Full Name" />
                              <input required className="w-full bg-bg border border-rule px-4 py-3 rounded-xl text-sm outline-none focus:border-accent transition-colors" type="email" placeholder="Institutional Email" />
                              <button className="w-full bg-ink text-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-ink/80 transition-colors shadow-lg">
                                Request {doc.tag} →
                              </button>
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50 italic">NDA Active · Confidential</span>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL ALPHA */}
      <Section id="alpha" className="bg-paper border-t border-rule">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            num="Operational Alpha"
            title="Five operational shifts. One fundamental change."
            lead="Each shift changes the economics of the operation. Together, they change the nature of the business — from reactive management to predictive intelligence."
          />
          
          <OperationalAlpha />
        </div>
      </Section>

      {/* CLOSER */}
      <div className="bg-[#2A2015] py-32 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-5"></div>
        <div className="max-w-[700px] mx-auto relative z-10 reveal">
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.1] font-bold text-white mb-8">
            The blueprints are done.<br /><em className="italic text-[#C4A47C]">Welcome to the room.</em>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-12 font-light">
            Questions, follow-up, or a conversation with the founders — we respond within 24 hours. <strong className="text-white font-medium">This is not a mailing list. This is a direct line.</strong>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-5 bg-[#C4A47C] text-[#2A2015] rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#C4A47C]/90 transition-all shadow-xl">
              Get in Touch
            </button>
            <Link to="/investor" className="px-10 py-5 border border-white/10 text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-all no-underline">
              Back to Investor View
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#2A2015] px-6 md:px-16 py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link className="font-serif text-xl font-bold text-white/50 no-underline hover:text-[#C4A47C] transition-colors" to="/">Cache Cow</Link>
          <div className="flex items-center gap-8">
            <Link to="/investor" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors">Investor View</Link>
            <Link to="/" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors">Public Site</Link>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">© 2026 CacheCow · Institutional Partner Access</span>
        </div>
      </footer>

      {/* FLYWHEEL PROMPT */}
      <AnimatePresence>
        {showFlywheelPrompt && (
          <div className="fixed inset-0 z-[800] bg-brand/95 backdrop-blur-md flex flex-col items-center justify-center font-mono p-6" onClick={() => setShowFlywheelPrompt(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-[500px] w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-accent/40 text-[10px] tracking-[0.3em] uppercase mb-12">ARTOFFICIAL SYSTEMS INC.</div>
              <div className="text-accent text-2xl tracking-widest mb-4 leading-relaxed uppercase">WHAT IS THE FLYWHEEL?</div>
              <p className="text-accent/40 text-xs mb-10 tracking-widest">_ ENTER ACCESS KEY TO PROCEED _</p>
              <input 
                autoFocus
                className="bg-transparent border-0 border-b-2 border-accent text-accent font-mono text-2xl tracking-[0.2em] text-center w-full outline-none py-4 caret-accent placeholder:opacity-20"
                type="text"
                value={flywheelInput}
                onChange={e => setFlywheelInput(e.target.value)}
                onKeyDown={checkFlywheel}
                placeholder="********"
              />
              {flywheelDenied && <div className="text-accent text-xs tracking-[0.3em] uppercase mt-8 animate-pulse">ACCESS DENIED.</div>}
              <div className="text-accent/20 text-[10px] tracking-[0.2em] mt-16 uppercase">
                PRESS ENTER TO SUBMIT · ESC TO CONTINUE
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRT TERMINAL */}
      <AnimatePresence>
        {showCRT && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-[#050401] overflow-hidden font-mono"
          >
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-[2] bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]"></div>
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(ellipse_90%_85%_at_50%_50%,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(217,119,6,0.05)_0%,transparent_100%)]"></div>
            
            <button onClick={closeCRT} className="absolute top-8 right-8 z-[10] bg-none border border-accent/20 text-accent/40 font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 hover:text-accent hover:border-accent transition-all">ESC / EXIT</button>
            
            <div className="px-8 py-6 border-b border-accent/10 flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent/40 rounded-full"></div>
                <div className="w-2 h-2 bg-accent/20 rounded-full"></div>
              </div>
              <span className="text-accent/30 text-[10px] tracking-[0.3em] uppercase">ARTOFFICIAL SYSTEMS — TRIPLE FLYWHEEL TERMINAL v1.0</span>
            </div>

            <div ref={crtRef} className="absolute top-24 bottom-0 left-0 right-0 p-8 md:p-16 overflow-y-auto scrollbar-hide">
              {crtOutput.map((line, i) => (
                <div key={i} className={`text-[clamp(12px,1.4vw,14px)] leading-relaxed tracking-widest whitespace-pre-wrap mb-2 ${line.cls}`}>
                  {line.txt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .crt-sys { color: rgba(217, 119, 6, 0.4); }
        .crt-ok { color: #d97706; }
        .crt-hi { color: #ffffff; font-weight: bold; letter-spacing: 0.1em; }
        .crt-dim { color: rgba(217, 119, 6, 0.3); }
        .crt-rule { color: rgba(217, 119, 6, 0.15); }
        .crt-title { color: #d97706; letter-spacing: 0.3em; text-transform: uppercase; font-size: 1.2em; }
        .crt-label { color: #fbbf24; letter-spacing: 0.15em; font-weight: bold; }
        .crt-body { color: rgba(217, 119, 6, 0.6); }
        .crt-item { color: rgba(217, 119, 6, 0.8); }
        .crt-prompt-line { color: #d97706; letter-spacing: 0.1em; }
        .crt-secret { color: #ffffff; font-size: clamp(20px, 3vw, 32px); letter-spacing: 0.5em; text-transform: uppercase; animation: secretpulse 2s ease-in-out infinite; text-align: center; display: block; margin: 2em 0; }
        .crt-cursor-line { color: #d97706; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes secretpulse { 0%, 100% { opacity: 1; text-shadow: 0 0 15px rgba(255, 255, 255, 0.5); } 50% { opacity: 0.5; text-shadow: none; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .tech-grid {
          background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
