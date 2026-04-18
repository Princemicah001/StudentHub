import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Calendar, Users, ShoppingBag, Image as ImageIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const totalDuration = duration * 1000;
    const increment = end / (totalDuration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function StatCard({ icon: Icon, value, label, meta, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.8 }}
      className="glass p-6 rounded-2xl relative group overflow-hidden"
    >
      <div className="absolute top-4 right-4 text-gold/30 font-mono text-[8px] tracking-[0.2em]">{meta}</div>
      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6 border border-gold/20">
        <Icon size={20} />
      </div>
      <p className="text-3xl font-serif text-white mb-1"><Counter value={value} /></p>
      <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">{label}</p>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const spotlightOpacity = useTransform(scrollY, [0, 500], [0.15, 0.05]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center px-6 lg:px-24 pt-16 overflow-hidden">
      {/* Background Spotlight */}
      <motion.div 
        style={{ opacity: spotlightOpacity }}
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#FFD700_0%,transparent_50%)] pointer-events-none z-0"
      />

      <div className="grid grid-cols-12 gap-12 w-full z-10">
        {/* Left Side (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold font-mono tracking-[0.4em] uppercase text-[10px] mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-gold/30" />
              MKU Law — The Platform
            </p>
            
            <h1 className="text-[clamp(64px,11vw,148px)] leading-[0.8] font-serif uppercase tracking-tighter flex flex-col">
              <span className="text-white">MKU</span>
              <span className="gold-outline italic ml-12 lg:ml-24">LAW.</span>
            </h1>

            <p className="mt-12 text-white/50 max-w-xl text-lg lg:text-xl font-sans tracking-wide leading-relaxed">
              Professional legal authority meets modern fluid aesthetics. 
              The premium command center for the next generation of legal practitioners at MKU.
            </p>
            
            <div className="mt-16 flex flex-wrap gap-8">
              <button className="group px-10 py-5 bg-gold text-obsidian font-black rounded-xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold-hover hover:scale-105 shadow-[0_20px_40px_rgba(255,215,0,0.2)] flex items-center gap-4">
                Enter The Market
                <ShoppingBag size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 border border-white/10 text-white font-bold rounded-xl text-xs tracking-[0.2em] uppercase hover:bg-white/5 transition-all">
                View All Events
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side (4 Columns) - Live Dashboard */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <p className="text-gold/60 font-mono tracking-[0.3em] uppercase text-[9px]">Live Dashboard</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Users} value={2408} label="Active Comrades" meta="RT-01" delay={0.1} />
            <StatCard icon={ShoppingBag} value={86} label="Market Listings" meta="RT-02" delay={0.2} />
            <StatCard icon={ImageIcon} value={142} label="Gallery Photos" meta="RT-03" delay={0.3} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="glass p-6 rounded-2xl relative group overflow-hidden col-span-1 border-gold/20"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-gold uppercase underline underline-offset-4">Pulse</span>
              </div>
              <p className="text-white text-xs font-medium leading-relaxed">
                <span className="text-gold">Julian V.</span> just updated his corporate portfolio.
              </p>
              <p className="mt-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">Platform Activity</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
