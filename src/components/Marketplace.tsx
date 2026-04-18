import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Bookmark, 
  ArrowRight, 
  AlertCircle,
  Search,
  SlidersHorizontal,
  Check,
  X,
  Briefcase,
  Globe,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useMemo } from 'react';
import { useVendors, type Vendor } from '@/hooks/useVendors';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

interface VendorCardProps {
  vendor: Vendor;
  onClick: () => void;
  key?: string | number;
}

function VendorCard({ vendor, onClick }: VendorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative p-2 rounded-[40px] glass border-white/5 hover:border-gold/30 transition-all duration-700 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden">
        <img 
          src={vendor.image} 
          alt={vendor.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          {vendor.top_vendor && (
            <div className="px-4 py-1.5 rounded-full bg-gold text-obsidian text-[9px] font-black tracking-widest uppercase shadow-2xl">
              Elite Tier
            </div>
          )}
          {vendor.verified && (
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl">
              <ShieldCheck size={18} />
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gold font-mono text-[9px] tracking-widest uppercase mb-2">{vendor.role}</p>
              <h3 className="text-3xl font-serif text-white uppercase tracking-tighter leading-none">{vendor.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-gold shadow-2xl">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-black">{vendor.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex items-center justify-between">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-obsidian bg-charcoal overflow-hidden">
              <img src={`https://picsum.photos/seed/v${i}/64/64`} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-obsidian bg-white/5 flex items-center justify-center text-[8px] font-bold text-white/40">
            +40
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/40 group-hover:text-gold transition-colors">
          <span className="text-[9px] font-mono tracking-widest uppercase">Portfolio</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

const CATEGORIES = [
  "Corporation", "Conveyance", "International", "Criminal", "Intellectual", "Civil", "Environmental"
];

export default function Marketplace() {
  const { data: vendors, isLoading, isError, error } = useVendors();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const channel = supabase
      .channel('marketplace-vendors')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendors' },
        (payload) => {
          queryClient.setQueryData<Vendor[]>(['vendors'], (old) => {
            if (!old) return old;
            if (payload.eventType === 'INSERT') {
              const newVendor = payload.new as Vendor;
              if (newVendor.is_published) return [...old, newVendor];
              return old;
            }
            if (payload.eventType === 'UPDATE') {
              const updatedVendor = payload.new as Vendor;
              if (!updatedVendor.is_published) {
                return old.filter(v => v.id !== updatedVendor.id);
              }
              const exists = old.find(v => v.id === updatedVendor.id);
              if (exists) {
                return old.map(v => v.id === updatedVendor.id ? { ...v, ...updatedVendor } : v);
              } else if (updatedVendor.is_published) {
                return [...old, updatedVendor];
              }
            }
            if (payload.eventType === 'DELETE') {
              return old.filter(v => v.id !== payload.old.id);
            }
            return old;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? v.role.toLowerCase().includes(activeCategory.toLowerCase()) : true;
      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col pt-24">
      <header className="px-6 lg:px-24 py-20 border-b border-white/5 bg-white/[0.01]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                <ShoppingBag size={24} />
              </div>
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-gold">The Market</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(48px,10vw,120px)] leading-[0.85] font-serif text-white uppercase tracking-tighter"
            >
              Elite Law School <br />
              <span className="italic gold-outline">Practitioners.</span>
            </motion.h1>
          </div>

          <div className="w-full lg:max-w-md space-y-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-8 text-white font-serif text-lg outline-none focus:border-gold/40 transition-all placeholder:text-white/10"
              />
            </div>
            <div className="flex justify-between items-center px-4">
              <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase">{filteredVendors.length} REVIEWS FOUND</p>
              <button className="flex items-center gap-2 text-gold font-mono text-[9px] tracking-widest uppercase hover:underline underline-offset-8">
                Request a Search
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-24 py-20 flex flex-col lg:flex-row gap-16">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-16 sticky top-32 h-fit">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-serif text-2xl">Refine</h3>
              <SlidersHorizontal size={20} className="text-gold" />
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/20 mb-6">Sector Specialisation</p>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-mono tracking-widest uppercase text-left transition-all border",
                    !activeCategory ? "bg-gold text-obsidian border-gold font-black" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                  )}
                >
                  All Sectors
                </button>
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-[10px] font-mono tracking-widest uppercase text-left transition-all border",
                      activeCategory === cat ? "bg-gold text-obsidian border-gold font-black" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[32px] border-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h4 className="text-white font-serif text-lg mb-4">Supreme Shield</h4>
            <p className="text-white/40 text-[10px] leading-relaxed mb-6 uppercase tracking-widest">Only 100% verified legal minds are permitted into the registry.</p>
            <div className="flex items-center gap-4 text-gold">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-mono tracking-widest uppercase">Verified Hub</span>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-2 rounded-[40px] glass border-white/5 space-y-6">
                  <Skeleton className="aspect-[4/5] rounded-[32px] bg-white/5" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-8 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[48px] border-red-500/10">
              <AlertCircle size={64} className="text-destructive mb-8" />
              <h3 className="text-4xl font-serif text-white mb-4">Connection Failed</h3>
              <p className="text-white/40 mb-12 max-w-md uppercase tracking-widest text-xs font-mono">The secure registry is currently unreachable.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-5 bg-gold text-obsidian font-black rounded-2xl tracking-[0.3em] uppercase text-xs hover:scale-105 transition-all"
              >
                Retry Link
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                  {filteredVendors?.map((vendor) => (
                    <VendorCard 
                      key={vendor.id}
                      vendor={vendor}
                      onClick={() => setSelectedVendor(vendor)} 
                    />
                  ))}
                </div>
              </AnimatePresence>
              
              {filteredVendors?.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-64 text-center glass rounded-[48px] border-white/5"
                >
                  <p className="text-white/20 font-serif text-3xl italic">No elite practitioners match your query.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory(null); }}
                    className="mt-12 text-gold font-mono text-[10px] tracking-widest uppercase hover:underline underline-offset-8"
                  >
                    Reset Filter Parameters
                  </button>
                </motion.div>
              )}
            </>
          )}

          <div className="mt-32 pt-20 border-t border-white/5 flex flex-col items-center gap-8">
             <p className="text-white/20 font-mono text-[9px] tracking-[0.4em] uppercase">Showing {filteredVendors.length} of {vendors?.length || 0} Elite Minds</p>
             <button className="px-12 py-5 glass rounded-2xl text-white font-bold tracking-widest uppercase text-xs hover:bg-white/5 transition-all">
               Load Next Sequence
             </button>
          </div>
        </main>
      </div>

      {/* Vendor Profile Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
              onClick={() => setSelectedVendor(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl h-full bg-[#080808] border-l border-white/5 flex flex-col relative z-20 shadow-[-40px_0_80px_rgba(0,0,0,0.5)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVendor(null)}
                className="absolute top-8 right-8 w-14 h-14 rounded-full glass border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-30"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative h-[600px]">
                  <img src={selectedVendor.image} alt={selectedVendor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  <div className="absolute bottom-16 left-16 right-16">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-gold text-obsidian font-black text-[9px] tracking-widest uppercase">Expert Profile</span>
                        {selectedVendor.verified && <ShieldCheck className="text-gold" size={20} />}
                      </div>
                      <h2 className="text-7xl font-serif text-white uppercase tracking-tighter leading-none mb-4">{selectedVendor.name}</h2>
                      <p className="text-gold font-mono tracking-[0.4em] uppercase text-xs">{selectedVendor.role}</p>
                    </motion.div>
                  </div>
                </div>

                <div className="p-16 space-y-20">
                  <div className="grid grid-cols-3 gap-8">
                    {[
                      { icon: Award, label: "Success Rate", value: selectedVendor.success_rate || "98%" },
                      { icon: Briefcase, label: "Experience", value: selectedVendor.experience || "12y+" },
                      { icon: Globe, label: "Jurisdiction", value: "MKU Alpha" },
                    ].map((metric, i) => (
                      <div key={i} className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                          <metric.icon size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono tracking-widest text-white/20 uppercase mb-1">{metric.label}</p>
                          <p className="text-2xl font-serif text-white">{metric.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-white font-serif text-3xl mb-8">Strategic Biography</h4>
                    <p className="text-white/40 text-lg leading-relaxed font-serif italic">
                      {selectedVendor.bio || `A highly distinguished practitioner specializing in ${selectedVendor.role.toLowerCase()}. With over a decade of experience in high-stakes litigation and advisory roles, ${selectedVendor.name} has built a reputation for excellence and strategic precision in the Comrade economy.`}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-serif text-3xl mb-8">Specialisations</h4>
                    <div className="flex flex-wrap gap-4">
                      {(selectedVendor.specializations || ['Advanced Litigation', 'Risk Extraction', 'Elite Advisory', 'Protocol Shield']).map((s, i) => (
                        <div key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 flex items-center gap-3">
                          <Check size={14} className="text-gold" />
                          <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                <button className="flex-1 py-6 bg-gold text-obsidian font-black rounded-[24px] tracking-[0.3em] uppercase text-xs hover:scale-[1.02] transition-all shadow-[0_20px_40px_rgba(255,215,0,0.2)]">
                  Message Specialist
                </button>
                <button className="w-20 h-20 rounded-[24px] glass border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <Bookmark size={24} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
