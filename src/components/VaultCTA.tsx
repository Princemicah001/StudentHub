import React from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight } from 'lucide-react';

export default function VaultCTA() {
  return (
    <section className="px-6 lg:px-24 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass rounded-[48px] border-white/5 p-12 lg:p-24 overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_80%_50%,rgba(180,78,255,0.15)_0%,transparent_70%)] group-hover:opacity-100 transition-opacity" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-16 relative z-10">
          <div>
            <p className="text-violet font-mono tracking-[0.4em] uppercase text-[10px] mb-8">Category: The Vault / Total Anonymity</p>
            <h2 className="text-6xl lg:text-8xl font-serif leading-[0.9] tracking-tighter mb-12">
              <span className="text-white">GOT A SECRET?</span> <br />
              <span className="gold-outline !-webkit-text-stroke-violet text-glow-violet italic">DROP IT HERE.</span>
            </h2>
            <div className="flex items-center gap-4 text-white/40 text-sm font-medium tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
              End-to-end encrypted submissions 
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-48 h-48 rounded-full bg-violet/10 border border-violet/20 flex items-center justify-center relative mb-12 shadow-[0_0_80px_rgba(180,78,255,0.2)]"
            >
              <div className="absolute inset-0 rounded-full border border-violet/30 animate-[ping_3s_ease-out_infinite]" />
              <Lock size={64} className="text-violet" />
            </motion.div>
            
            <a href="/vault" className="group flex items-center gap-6 text-white font-bold tracking-[0.3em] uppercase text-xs hover:text-gold transition-colors">
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Submit Anonymously
              </motion.span>
              <ArrowRight size={20} className="text-violet group-hover:text-gold transition-colors" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet/50 to-transparent opacity-30" />
      </motion.div>
    </section>
  );
}
