import { Section, Reveal, SectionHeader, Parallax, Counter } from './components/Layout';
import { MarketComparison } from './components/MarketComparison';
import { ValueModel } from './components/ValueModel';
import { ThePattern } from './components/ThePattern';
import { ReadingShadows } from './components/ReadingShadows';
import { IndustryDisruption } from './components/IndustryDisruption';
import { BessieCallProcess } from './components/BessieCallProcess';
import { Dashboard } from './components/Dashboard';
import { NDASigner } from './components/NDASigner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArrowRight, ShieldCheck, Activity, Zap, Database, TrendingUp, LogIn, LogOut, User as UserIcon, X } from 'lucide-react';
import { cn } from './lib/utils';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, doc, getDoc, setDoc, OperationType, handleFirestoreError } from './firebase';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = ({ user, onSignIn, onSignOut, currentView, onViewChange }: { 
  user: User | null, 
  onSignIn: () => void, 
  onSignOut: () => void,
  currentView: 'landing' | 'portal' | 'campaign',
  onViewChange: (view: 'landing' | 'portal' | 'campaign') => void
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-rule h-16 flex items-center justify-between px-6 md:px-16">
    <button 
      onClick={() => onViewChange('landing')}
      className="font-serif text-xl font-bold text-brand hover:opacity-70 transition-opacity"
    >
      CacheCow
    </button>
    <div className="flex gap-4 md:gap-8 items-center">
      <div className="hidden lg:flex gap-8 items-center">
        {currentView !== 'portal' ? (
          ['Problem', 'Platform', 'Alpha', 'Disruption', 'Semantic', 'Monetization', 'Economics'].map((item) => (
            <a 
              key={item} 
              href={`/about/#${item.toLowerCase() === 'semantic' ? 'bessie-call' : item.toLowerCase()}`} 
              className="text-[11px] font-bold tracking-widest uppercase text-muted hover:text-brand transition-colors"
            >
              {item}
            </a>
          ))
        ) : (
          <button 
            onClick={() => onViewChange('landing')}
            className="text-[11px] font-bold tracking-widest uppercase text-muted hover:text-brand transition-colors"
          >
            Back to Home
          </button>
        )}
      </div>
      {user ? (
        <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 border-l border-rule">
          {currentView !== 'portal' && (
            <button 
              onClick={() => onViewChange('portal')}
              className="text-[11px] font-bold tracking-widest uppercase text-brand hover:opacity-70 transition-colors mr-2"
            >
              Investor Portal
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center text-[11px] md:text-[12px] font-bold text-brand border border-accent/20">
              {user.displayName?.charAt(0) || 'U'}
            </div>
            <span className="hidden sm:inline text-[12px] md:text-[13px] font-bold text-ink">{user.displayName?.split(' ')[0]}</span>
          </div>
          <button onClick={onSignOut} className="text-muted hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={onSignIn}
          className="flex items-center gap-2 text-[11px] md:text-[12px] font-bold tracking-widest uppercase text-brand hover:opacity-70 transition-colors"
          title="Sign in with Google to access Investor Materials"
        >
          <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Investor Sign In</span>
        </button>
      )}
    </div>
  </nav>
);

const Hero = ({ onCinematicMode }: { onCinematicMode: () => void }) => (
  <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-16 py-24 overflow-hidden">
    {/* Background Video/Image */}
    <div className="absolute inset-0 z-0">
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      {/* Brand Overlay with 45% transparency */}
      <div className="absolute inset-0 bg-brand/45 mix-blend-multiply" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-brand/20 to-brand/60" />
    </div>

    <Parallax speed={0.2} className="absolute inset-0 opacity-10 hero-grid z-0" />
    <Parallax speed={-0.3} className="absolute -top-48 -right-48 w-[800px] h-[800px] rounded-full bg-accent/10 blur-[120px] z-0" />
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <Reveal>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="micro-label text-accent tracking-[0.4em] uppercase font-bold">
            Biological Asset Intelligence
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="text-6xl sm:text-8xl md:text-[14rem] font-bold text-white leading-[0.8] mb-12 tracking-[-0.04em]">
          Cache<span className="text-accent italic font-serif font-light">Cow</span>
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-xl sm:text-2xl md:text-4xl font-light text-white/60 max-w-3xl leading-tight mb-16">
          Transforming biological risk into a <span className="text-white">predictable asset class</span> through continuous, high-fidelity data streams.
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-24">
          <button className="bg-accent text-brand px-10 py-5 rounded-full font-bold tracking-widest uppercase text-[11px] hover:bg-white transition-all duration-500 shadow-2xl shadow-accent/20 w-full sm:w-auto">
            Request Deck
          </button>
          <button 
            disabled
            className="border border-white/10 text-white/30 px-10 py-5 rounded-full font-bold tracking-widest uppercase text-[11px] backdrop-blur-md flex items-center justify-center gap-3 cursor-not-allowed w-full sm:w-auto"
            title="Cinematic Mode coming soon"
          >
            <Activity className="w-4 h-4 text-white/20" />
            Cinematic Mode
          </button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { val: 75, isCurrency: true, label: "Unit cost", sub: "Scalable hardware", icon: Database },
          { val: 50, isCurrency: true, suffix: "/yr", label: "SaaS Revenue", sub: "High-margin recurring", icon: TrendingUp },
          { val: "50/50", label: "Data Royalty", sub: "Permanent revenue share", icon: ShieldCheck },
          { val: 15.8, suffix: "×", label: "LTV/CAC", sub: "Unprecedented efficiency", icon: Zap },
        ].map((stat, i) => (
          <Reveal key={i} delay={0.3 + i * 0.1} className="relative group h-full">
            <div className="absolute inset-0 bg-accent/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-full bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-accent/30 hover:bg-white/[0.06] transition-all duration-500 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-accent/30 transition-colors">
                  <stat.icon className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
                </div>
                <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 group-hover:text-accent/40 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">{stat.label}</div>
                <div className="text-4xl md:text-5xl font-bold text-white leading-none tracking-tight mb-4 group-hover:text-accent transition-colors">
                  {typeof stat.val === 'number' ? (
                    <Counter value={stat.val} isCurrency={stat.isCurrency} suffix={stat.suffix} />
                  ) : (
                    stat.val
                  )}
                </div>
                <div className="text-[10px] text-white/20 tracking-wider font-light leading-relaxed">{stat.sub}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

import { InvestorPortal } from './components/InvestorPortal';

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import DocumentVault from './components/DocumentVault';
import { CampaignLanding } from './components/CampaignLanding';

function MainApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [rancherProfile, setRancherProfile] = useState<any>(null);
  const [ndaSigned, setNdaSigned] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname === '/investor' ? 'portal' : location.pathname === '/campaign' ? 'campaign' : 'landing';

  const setCurrentView = (view: 'landing' | 'portal' | 'campaign') => {
    if (view === 'campaign') navigate('/campaign');
    else navigate(view === 'portal' ? '/investor' : '/about');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        if (location.pathname !== '/vault') {
          setCurrentView('portal');
        }
        try {
          const profileDoc = await getDoc(doc(db, 'ranchers', currentUser.uid));
          if (profileDoc.exists()) {
            setRancherProfile(profileDoc.data());
          } else {
            // Create initial profile
            const newProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Rancher',
              email: currentUser.email || '',
              ranchName: 'My Ranch',
              role: 'rancher'
            };
            await setDoc(doc(db, 'ranchers', currentUser.uid), newProfile);
            setRancherProfile(newProfile);
          }

          // Check NDA status
          const ndaDoc = await getDoc(doc(db, 'ndas', currentUser.uid));
          setNdaSigned(ndaDoc.exists());
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `ranchers/${currentUser.uid}`);
        }
      } else {
        setRancherProfile(null);
        setNdaSigned(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentView('landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar 
          user={user} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <AnimatePresence mode="wait">
          {user && isAuthReady && currentView === 'portal' ? (
            <motion.div
              key="portal"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-paper min-h-screen"
            >
              {!ndaSigned ? (
            <div className="pt-20">
              <Section id="investor-portal" className="bg-paper border-t border-rule min-h-screen">
                <SectionHeader 
                  num="Investor Portal"
                  title="Confidential Materials & Financial Models"
                  lead="Access high-fidelity projections, detailed unit economics, and our technical roadmap."
                />
                
                <div className="mt-12">
                  <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-widest mb-6">
                      Stage 2 Access Required
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-ink mb-6">Automated Due Diligence Workflow</h3>
                    <p className="text-muted leading-relaxed font-light">
                      To protect our proprietary biological time series algorithms and technical specifications, access to stage 2 materials requires a Mutual Non-Disclosure Agreement.
                    </p>
                  </div>
                  <NDASigner user={user} onSigned={() => setNdaSigned(true)} />
                </div>
              </Section>
            </div>
              ) : (
                <InvestorPortal onViewChange={setCurrentView} />
              )}
            </motion.div>
          ) : currentView === 'campaign' ? (
            <motion.div
              key="campaign"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="pt-16"
            >
              <CampaignLanding />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Hero onCinematicMode={() => {}} />

            <Section id="problem">
              <SectionHeader 
                num="01 — The Information Asymmetry"
                title="The industry has GPS coordinates. It doesn't have intelligence."
                lead="Every technology currently deployed on livestock asks the same question: where is this animal, and is something visibly wrong with it right now? These are reactive instruments in a business that desperately needs predictive ones."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <div className="space-y-10">
                  <p className="text-xl text-ink font-light leading-relaxed">
                    The consequences show up in the numbers. A 2–4% annual mortality rate that hasn't meaningfully moved in decades. Veterinary bills that spike without warning. Breeding cycles missed because estrus detection is still 50–60% accurate with experienced eyes. Insurance premiums priced on herd averages because individual animal risk is invisible.
                  </p>
                  <p className="text-xl text-ink font-light leading-relaxed">
                    These are not operational failures. They are information failures. We are making decisions about living biological systems with tools designed to tell us something has already gone wrong — not that something is about to.
                  </p>
                </div>
                <Reveal className="editorial-card p-12 bg-paper">
                  <span className="micro-label text-accent mb-6 block">The Opportunity</span>
                  <p className="text-3xl font-serif font-light text-brand leading-tight italic">
                    "GPS tells you where an asset is. It doesn't tell you the asset's trajectory — biologically. The question the market has never been able to ask is: is this asset's trajectory over the last 72 hours consistent with the pattern that preceded a value crash in 87% of similar cases?"
                  </p>
                </Reveal>
              </div>
            </Section>

            <Section id="platform">
              <SectionHeader 
                num="02 — The Infrastructure"
                title="Not a collar. Not a tracker. A biological intelligence engine."
                lead="CacheCow generates a continuous biological time series for each animal — an unbroken record of how that specific cow moves, rests, eats, breeds, responds to heat, recovers from stress, and changes over time."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 my-12 bg-[#2A2015] divide-y md:divide-y-0 md:divide-x divide-white/10">
                {[
                  {
                    num: "01",
                    title: "Cowculus™",
                    desc: "The continuous calculus of the animal — every derivative of movement, temperature, gait, rumination, and bio-magnetic state integrated in real time. The engine running inside every tier.",
                    stats: [
                      { label: "SENSOR FREQUENCY", value: "400Hz motion capture" },
                      { label: "SPATIAL PRECISION", value: "±2cm positioning" },
                      { label: "HEALTH LEAD TIME", value: "72hr early detection" },
                      { label: "DATA TYPE", value: "Physiological · direct" }
                    ]
                  },
                  {
                    num: "02",
                    title: "Machine Herding™",
                    desc: "AI that doesn't just observe — it acts. Routes alerts, synthesizes voice, models outcomes, and manages herd intelligence the way a stockdog manages cattle. The output the farmer receives.",
                    stats: [
                      { label: "INTERFACE", value: "Natural language voice" },
                      { label: "ALERT ROUTING", value: "Real-time · mobile" },
                      { label: "VOICE SIGNATURES", value: "Unique per animal" },
                      { label: "URGENCY CALIBRATION", value: "Adaptive tone" }
                    ]
                  },
                  {
                    num: "03",
                    title: "Schrödinger's Fence™",
                    desc: "Quantum tissue-coupling fencing. No shock. No aversion. The animal internalizes the boundary at a biological level — it simply doesn't approach it. The fence works because the animal understands it, not because it fears it.",
                    stats: [
                      { label: "MECHANISM", value: "Quantum tissue-coupling" },
                      { label: "AVERSIVE CONDITIONING", value: "None · zero shocks" },
                      { label: "INFRASTRUCTURE", value: "Zero · mesh-native" },
                      { label: "WELFARE CERTIFICATION", value: "Auditable · on-record" }
                    ]
                  }
                ].map((card, i) => (
                  <Reveal key={i} delay={i * 0.1} className="p-10 md:p-12 flex flex-col h-full">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 mb-6">{card.num}</div>
                    <div className="text-2xl font-serif font-bold text-white mb-4">{card.title}</div>
                    <p className="text-white/60 leading-relaxed font-light mb-10 flex-grow">{card.desc}</p>
                    <div className="space-y-4 pt-8 border-t border-white/10">
                      {card.stats.map((stat, j) => (
                        <div key={j} className="flex justify-between items-center text-[10px] sm:text-[11px] gap-4">
                          <span className="text-white/30 font-bold tracking-widest uppercase shrink-0">{stat.label}</span>
                          <span className="text-[#C4A47C] font-medium text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            </Section>

            <ThePattern />
            
            <ReadingShadows />

            <Section id="alpha" className="pt-12 md:pt-24 pb-0 border-b-0">
              <SectionHeader 
                num="03 — Operational Alpha"
                title="The Economics of Intelligence"
                lead="Changing the nature of the business — from reactive management to predictive intelligence."
                className="mb-8"
              />
            </Section>
            <ValueModel />

            {/* MARKET DISRUPTION */}
            <Section id="disruption" className="bg-bg border-t border-rule">
              <SectionHeader 
                num="04 — Market Disruption"
                title="Three industries structurally mis-priced. One dataset changes all of them."
                lead="Insurance, genetics, and veterinary medicine have each been operating blind. The Motion Intelligence Index gives them what they've never had."
              />
              <IndustryDisruption />
            </Section>

            {/* SEMANTIC LAYER */}
            <Section id="bessie-call" className="bg-bg border-t border-rule">
              <div className="max-w-7xl mx-auto">
                <SectionHeader 
                  num="05 — The Semantic Layer"
                  title="Bessie calls the rancher. The biological narrative comes alive."
                  lead="Raw biometric data is useless in the field. We translate 400Hz motion signals into natural, multi-turn dialogue."
                />
                <BessieCallProcess />
              </div>
            </Section>

            {/* DIGITAL HOMESTEAD */}
            <section id="monetization" className="px-6 md:px-16 py-24 bg-[#2A2015] border-none">
              <div className="max-w-7xl mx-auto">
                <Reveal>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B97A36] mb-6 block">The Digital Homestead Act</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-normal text-white leading-tight mb-10">Your land. Your labour.<br />Your data. <em className="text-[#B97A36] italic">Your legacy.</em></h2>
                    <div className="font-serif text-3xl md:text-4xl font-normal italic leading-snug text-white/90 pl-6 border-l-2 border-[#B97A36] mb-6">"In 1862, the Homestead Act secured the rights of families to the land they worked. Every biological signal generated by your herd is a product of your labour. You deserve 100% of the ownership and a permanent, fair share of the revenue."</div>
                    <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/40 pl-7 mb-12">— The CacheCow Promise</div>
                    <p className="text-white/50 leading-relaxed font-light text-sm md:text-base pr-4">The data royalty isn't a feature. It's the founding principle. The rancher who deploys CacheCow is not buying a cost-reduction tool. They are becoming the originating source of a dataset that pharmaceutical companies, insurers, and commodity finance institutions will pay to access — permanently. <strong className="text-white/80 font-medium">The 50/50 split means the rancher's interest and the platform's interest are identical. Forever.</strong></p>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#2A2015] border border-[#D1C8B8]/20">
                      {[
                        { t: 'Genomic + Biometric · Pharmaceutical', v: '$14', f: 'Paid by pharma companies', b: 'Unique genetic markers and real-time biometric signatures are high-value assets for drug development and research. Pharma companies pay for population-level real-world data they cannot generate in a lab.' },
                        { t: 'Motion Intelligence · Supply Chain', v: '$17.50', f: 'Paid by logistics partners', b: 'Logistics and supply chain partners pay for the predictability and transparency that biological intelligence provides across the full animal lifecycle from pasture to processing.' },
                        { t: 'Health Event Records · Insurance', v: '$9', f: 'Paid by insurers', b: 'Insurers license health data to move from population-average pricing to per-animal dynamic risk scores. Your transparency lowers their claims risk. They pay you for it.' },
                        { t: 'Current market', v: '$0', f: 'No revenue share exists today', b: 'Every biological signal your herd generates is currently captured by third parties at zero benefit to you. The data exists. It has value. It has simply never been yours — until now.', s: true }
                      ].map((rc, i) => (
                        <div key={i} className={`p-8 transition-colors ${rc.s ? 'bg-[#E5DFD3]' : 'bg-[#F3EFE6]'}`}>
                          <span className={`text-[9px] font-bold tracking-[0.16em] uppercase mb-4 block ${rc.s ? 'text-[#2A2015]/40' : 'text-[#B97A36]'}`}>{rc.t}</span>
                          <div className={`font-serif text-4xl md:text-5xl font-bold leading-none mb-2 ${rc.s ? 'text-[#2A2015]/40' : 'text-[#2A2015]'}`}>{rc.v}<span className="text-lg font-sans font-light opacity-60">/head/yr</span></div>
                          <span className={`text-[10px] tracking-widest uppercase mb-5 block ${rc.s ? 'text-[#2A2015]/30' : 'text-[#2A2015]/40'}`}>{rc.f}</span>
                          <p className={`text-xs leading-relaxed ${rc.s ? 'text-[#2A2015]/60' : 'text-[#2A2015]/70'}`}>{rc.b}</p>
                        </div>
                      ))}
                      <div className="md:col-span-2 bg-[#B97A36] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                          <div className="font-serif text-4xl md:text-5xl font-bold text-white leading-none mb-2">$51.50<span className="text-lg font-sans font-medium opacity-80">/head/yr</span></div>
                          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80 block mt-3">500 head = $25,750 / year · passive · permanent</span>
                        </div>
                        <p className="text-xs leading-relaxed text-white/90 max-w-[380px] font-medium">The combined royalty compounds every year the dataset deepens. Year 5 data is worth more than Year 1 data. The rancher who starts first earns the most — permanently.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <Section id="economics">
              <SectionHeader 
                num="06 — Unit Economics"
                title="$75 device. $50/year. No infrastructure."
                lead="The complete cost structure. No towers. No base stations. No cellular contracts. The mesh network is built into the devices themselves."
              />
              <MarketComparison />
              <div className="mt-16 max-w-3xl">
                <p className="text-2xl font-serif font-light text-ink leading-relaxed italic">
                  "The cost comparison understates CacheCow's advantage. Every other platform is a pure cost tool. CacheCow is the only system where the rancher's investment generates a return stream independent of operational savings."
                </p>
              </div>
            </Section>

            <footer className="bg-brand py-24 md:py-32 text-center px-6 md:px-16">
              <div className="max-w-3xl mx-auto">
                <Reveal>
                  <h2 className="text-5xl md:text-7xl text-white mb-10">Why Now</h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-xl font-light text-white/50 leading-relaxed mb-16">
                    The bovine Motion Intelligence Index needs to be trained before the window closes. A competitor entering this market in three years starts with zero data against a system that has observed hundreds of thousands of complete biological time series.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <button 
                    onClick={handleSignIn}
                    className="bg-accent text-white px-12 py-6 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-brand transition-all flex items-center gap-3 mx-auto"
                  >
                    Request Investment Deck <ArrowRight className="w-5 h-5" />
                  </button>
                </Reveal>
                <div className="mt-24 micro-label text-white/20">
                  Confidential · CacheCow / ForcedField Technologies · Calgary, Alberta
                </div>
              </div>
            </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<MainApp />} />
        <Route path="/investor" element={<MainApp />} />
        <Route path="/vault" element={<DocumentVault />} />
        <Route path="/campaign" element={<MainApp />} />
      </Routes>
    </>
  );
}
