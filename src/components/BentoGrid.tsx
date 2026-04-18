import React from 'react';
import { motion } from 'motion/react';
import { Lock, TrendingUp, Users, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  icon?: React.ElementType;
  delay?: number;
}

function BentoItem({ className, children, title, icon: Icon, delay = 0 }: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "relative group p-8 rounded-[32px] glass border-white/5 overflow-hidden transition-all duration-500 hover:border-gold/30",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {title && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {Icon && <Icon size={20} className="text-violet" />}
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40">{title}</h3>
          </div>
          <ArrowUpRight size={16} className="text-white/20 group-hover:text-gold transition-colors" />
        </div>
      )}
      
      {children}
    </motion.div>
  );
}

export default function BentoGrid() {
  const practitioners = [
    { name: "Julian Vane", role: "Corporate Law", avatar: "https://picsum.photos/seed/p1/100/100" },
    { name: "Elena Rossi", role: "Intellectual Property", avatar: "https://picsum.photos/seed/p2/100/100" },
    { name: "Marcus Thorne", role: "Criminal Defense", avatar: "https://picsum.photos/seed/p3/100/100" },
    { name: "Sarah Chen", role: "Tech Litigation", avatar: "https://picsum.photos/seed/p4/100/100" },
  ];

  return (
    <section className="px-6 lg:px-24 py-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Marketplace Highlight (Wide Tile) */}
        <BentoItem className="md:col-span-3" title="Marketplace Highlight" icon={Users}>
          <div className="flex flex-col h-full">
            <h2 className="text-4xl font-serif text-white mb-8">Top Practitioners</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {practitioners.map((p, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex-shrink-0 w-64 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-gold/50 transition-all duration-500"
                >
                  <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-2xl mb-4 object-cover" referrerPolicy="no-referrer" />
                  <h4 className="text-gold font-serif text-xl mb-1">{p.name}</h4>
                  <p className="text-white/40 text-sm mb-6">{p.role}</p>
                  <button className="w-full py-3 rounded-xl bg-white/5 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all">
                    Hire Now
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </BentoItem>

        {/* Anonymous Feedback Module (Square Tile) */}
        <BentoItem className="md:col-span-1 group cursor-pointer" title="Vault" icon={Lock} delay={0.2}>
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-violet/40 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Lock size={48} className="text-violet relative z-10" />
            </div>
            <p className="text-2xl font-sans font-bold leading-tight">
              100% Anonymous. <br />
              <span className="text-violet">100% Heard.</span>
            </p>
            <div className="mt-8 flex items-center gap-2 text-white/20 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck size={12} />
              <span>Encrypted Submission</span>
            </div>
          </div>
        </BentoItem>

        {/* Leaderboard (Tall Tile) */}
        <BentoItem className="md:row-span-2 md:col-span-1" title="Leaderboard" icon={TrendingUp} delay={0.4}>
          <div className="flex flex-col h-full">
            <div className="space-y-6 mt-4">
              {[
                { rank: "01", name: "Julian Vane", score: "9.8" },
                { rank: "02", name: "Elena Rossi", score: "9.6" },
                { rank: "03", name: "Marcus Thorne", score: "9.4" },
                { rank: "04", name: "Sarah Chen", score: "9.2" },
                { rank: "05", name: "David Miller", score: "9.0" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4">
                    <span className="text-violet font-mono text-xs font-bold opacity-40 group-hover/item:opacity-100 transition-opacity">{item.rank}</span>
                    <span className="text-white/80 font-medium group-hover/item:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-violet font-bold text-glow-violet">{item.score}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-12">
              <button className="w-full py-4 glass rounded-2xl text-white/40 text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors">
                View Full Rankings
              </button>
            </div>
          </div>
        </BentoItem>

        {/* Additional Tile (Square) */}
        <BentoItem className="md:col-span-2" title="Global Reach" delay={0.6}>
          <div className="h-full flex flex-col justify-center">
            <h3 className="text-3xl font-serif text-white mb-4">Connecting 50+ Jurisdictions</h3>
            <p className="text-white/40 text-sm max-w-md">
              Our network spans across the globe, providing seamless legal integration for international businesses and individual practitioners.
            </p>
            <div className="mt-8 flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://picsum.photos/seed/avatar${i}/64/64`}
                  className="w-10 h-10 rounded-full border-2 border-obsidian"
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-charcoal border-2 border-obsidian flex items-center justify-center text-[10px] font-bold text-white/40">
                +2k
              </div>
            </div>
          </div>
        </BentoItem>

        {/* Small Tile */}
        <BentoItem className="md:col-span-1" title="Security" delay={0.8}>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShieldCheck size={32} className="text-gold mb-4" />
            <span className="text-gold font-bold text-lg">Verified</span>
          </div>
        </BentoItem>
      </div>
    </section>
  );
}
