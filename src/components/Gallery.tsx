import { motion } from 'motion/react';
import { Camera, Hash, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Gallery() {
  const [filter, setFilter] = useState<string | null>(null);

  const images = [
    { id: 1, url: "https://picsum.photos/seed/g1/800/1200", tag: "#Event2026", author: "Julian Vane", size: "tall" },
    { id: 2, url: "https://picsum.photos/seed/g2/800/600", tag: "#LegalTech", author: "Elena Rossi", size: "wide" },
    { id: 3, url: "https://picsum.photos/seed/g3/800/800", tag: "#Event2026", author: "Marcus Thorne", size: "square" },
    { id: 4, url: "https://picsum.photos/seed/g4/800/1000", tag: "#Networking", author: "Sarah Chen", size: "tall" },
    { id: 5, url: "https://picsum.photos/seed/g5/800/600", tag: "#LegalTech", author: "David Miller", size: "wide" },
    { id: 6, url: "https://picsum.photos/seed/g6/800/800", tag: "#Event2026", author: "Aria Stark", size: "square" },
  ];

  const filteredImages = filter ? images.filter(img => img.tag === filter) : images;

  return (
    <section className="px-6 lg:px-24 py-24">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet/20 flex items-center justify-center text-violet">
              <Camera size={20} />
            </div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-violet">Gallery</span>
          </div>
          <h2 className="text-[60px] md:text-[80px] leading-[0.9] font-serif text-white uppercase tracking-tighter">
            Visual <br />
            <span className="italic text-white/40">Authority.</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {["#Event2026", "#LegalTech", "#Networking"].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(filter === tag ? null : tag)}
              className={cn(
                "px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300",
                filter === tag ? "bg-violet text-white" : "glass text-white/40 hover:text-white"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredImages.map((img) => (
          <motion.div
            key={img.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative group rounded-[32px] overflow-hidden glass border-white/5 cursor-pointer break-inside-avoid"
          >
            <img
              src={img.url}
              alt="Gallery"
              className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale group-hover:blur-[2px]"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/20 text-white text-[10px] font-bold tracking-widest uppercase">
                  <Hash size={12} className="text-violet" />
                  {img.tag}
                </div>
                <div className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              </div>

              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-2">Captured by</p>
                <h4 className="text-2xl font-serif text-white">{img.author}</h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
