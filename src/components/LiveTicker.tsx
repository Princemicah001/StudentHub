import React from 'react';
import { motion } from 'motion/react';

const NEWS_ITEMS = [
  "MKU LAW SCHOOL MARKETPLACE IS NOW LIVE",
  "NEW EVENT: MOOT COURT COMPETITION 2026 - REGISTRATION OPEN",
  "SECURE YOUR SPOT AT THE UPCOMING GAVEL GALA",
  "THE VAULT: 124 NEW ANONYMOUS FEEDBACKS RECEIVED THIS WEEK",
  "TOP VENDOR SPOTLIGHT: JULIAN VANE - CORPORATE STRATEGY EXPERT",
  "PLATFORM UPDATE: SUB-100MS LATENCY ACHIEVED FOR ALL COMRA DES",
];

export default function LiveTicker() {
  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-black/95 border-b border-gold/20 z-[60] overflow-hidden flex items-center">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap"
      >
        <div className="flex gap-12 px-12">
          {NEWS_ITEMS.map((item, i) => (
            <span key={i} className="text-gold font-mono text-[10px] tracking-widest flex items-center gap-4">
              <span className="w-1 h-1 bg-gold rounded-full" />
              {item}
            </span>
          ))}
        </div>
        <div className="flex gap-12 px-12">
          {NEWS_ITEMS.map((item, i) => (
            <span key={`dup-${i}`} className="text-gold font-mono text-[10px] tracking-widest flex items-center gap-4">
              <span className="w-1 h-1 bg-gold rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
