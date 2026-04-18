import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, CheckCircle } from 'lucide-react';

const TOP_VENDORS = [
  { name: "Julian Vane", specialty: "Corporate Law", score: "9.8", avatar: "p1", tag: "Tech" },
  { name: "Elena Rossi", specialty: "Intellectual Property", score: "9.6", avatar: "p2", tag: "Fashion" },
  { name: "Marcus Thorne", specialty: "Criminal Defense", score: "9.4", avatar: "p3", tag: "Food" },
];

export default function MarketplaceHighlights() {
  return (
    <section className="px-6 lg:px-24 py-32 bg-white/[0.01]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <p className="text-gold font-mono tracking-widest text-[10px] mb-6 uppercase">Category: Marketplace / Top legal minds. Right here.</p>
          <h2 className="text-5xl font-serif text-white leading-tight">Elite Comrade Economy.</h2>
        </div>
        <button className="px-8 py-4 border border-white/10 text-white font-bold rounded-xl text-xs tracking-widest uppercase hover:bg-white/5 transition-all">
          Explore All Vendors
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOP_VENDORS.map((vendor, i) => (
          <motion.div
            key={vendor.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass p-10 rounded-[40px] border-white/5 relative group cursor-pointer hover:border-gold/30 transition-all duration-500"
          >
            <div className="absolute top-8 right-8 text-gold/30 font-mono text-[9px] tracking-widest uppercase">{vendor.tag}</div>
            
            <div className="relative w-20 h-20 mb-8">
              <img 
                src={`https://picsum.photos/seed/${vendor.avatar}/200/200`} 
                alt={vendor.name}
                className="w-full h-full rounded-full object-cover border-2 border-gold/20 p-1 bg-black group-hover:border-gold/50 transition-colors"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 bg-gold text-obsidian rounded-full p-1 border-2 border-black">
                <CheckCircle size={14} />
              </div>
            </div>

            <h3 className="text-2xl font-serif text-white mb-2">{vendor.name}</h3>
            <p className="text-white/40 text-sm mb-12">{vendor.specialty}</p>

            <div className="flex justify-between items-center pt-8 border-t border-white/5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className={j < 4 ? "text-gold fill-gold" : "text-white/10"} />
                ))}
              </div>
              <div className="text-gold font-serif text-2xl">{vendor.score}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
