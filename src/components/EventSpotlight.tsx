import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useEvents, useEventRsvp, type CampusEvent } from '@/hooks/useEvents';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function EventSpotlight() {
  const { data: events, isLoading } = useEvents();
  const rsvpMutation = useEventRsvp();
  const [user, setUser] = useState<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Real-time synchronization
    const channel = supabase
      .channel('events-spotlight')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          // Intelligently patch the cache instead of full refetch
          queryClient.setQueryData<CampusEvent[]>(['events'], (old) => {
            if (!old) return old;
            if (payload.eventType === 'INSERT') return [...old, payload.new as CampusEvent];
            if (payload.eventType === 'UPDATE') {
              return old.map(ev => ev.id === payload.new.id ? { ...ev, ...payload.new } : ev);
            }
            if (payload.eventType === 'DELETE') {
              return old.filter(ev => ev.id !== payload.old.id);
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

  const featuredEvent = events?.find(e => e.is_featured) || events?.[0];

  const handleRSVP = async () => {
    if (!user) {
      toast.error('Authentication required', { description: 'Please login to RSVP for events.' });
      return;
    }
    if (!featuredEvent) return;

    rsvpMutation.mutate({ eventId: featuredEvent.id, userId: user.id }, {
      onSuccess: () => toast.success('RSVP Confirmed', { description: `You are registered for ${featuredEvent.title}` }),
      onError: (err: any) => toast.error('RSVP Failed', { description: err.message || 'The registry could not process your request.' })
    });
  };

  if (isLoading || !featuredEvent) {
    return (
      <section className="px-6 lg:px-24 py-32 flex items-center justify-center min-h-[600px]">
        <Loader2 className="animate-spin text-gold" size={48} />
      </section>
    );
  }

  const occupancyPercent = ((featuredEvent.total_seats - featuredEvent.seats_remaining) / featuredEvent.total_seats) * 100;

  return (
    <section className="px-6 lg:px-24 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-gold font-mono tracking-widest text-[10px] mb-6 uppercase">Category: Events / Spotlight</p>
        <h2 className="text-6xl font-serif text-white mb-8 leading-tight">
          {featuredEvent.title}
        </h2>
        <p className="text-white/40 text-lg max-w-md mb-12">
          {featuredEvent.description || "Join the elite legal community at MKU for an evening of networking, awards, and the state-of-the-market address."}
        </p>
        <a href="/events" className="text-gold flex items-center gap-4 font-bold tracking-widest uppercase text-xs hover:gap-6 transition-all group">
          Explore all events
          <ArrowRight size={16} className="group-hover:translate-x-1" />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass p-12 rounded-[40px] border-white/5 relative group"
      >
        <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold tracking-widest uppercase">
          Featured Protocol
        </div>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Calendar size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-white mb-1">{featuredEvent.title}</h3>
            <p className="text-white/40 flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-gold" />
              {featuredEvent.location || "Main Auditorium, MKU Law"}
            </p>
          </div>
        </div>

        {/* Static Date Grid as Placeholder for Countdown */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Date', val: new Date(featuredEvent.date).getDate() },
            { label: 'Month', val: new Date(featuredEvent.date).getMonth() + 1 },
            { label: 'Year', val: new Date(featuredEvent.date).getFullYear() },
            { label: 'Capacity', val: featuredEvent.total_seats },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group-hover:border-gold/30 transition-colors">
              <p className="text-2xl font-serif text-white mb-1 leading-none">{item.val}</p>
              <p className="text-[8px] font-mono tracking-widest text-white/20 uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-[10px] font-mono tracking-widest mb-4">
            <span className="text-gold">SEATS REMAINING</span>
            <span className="text-white">{featuredEvent.seats_remaining} / {featuredEvent.total_seats}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${100 - occupancyPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-gold/50 to-gold shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            />
          </div>
        </div>

        <button 
          onClick={handleRSVP}
          disabled={rsvpMutation.isPending || featuredEvent.seats_remaining <= 0}
          className="w-full py-6 bg-gold text-obsidian font-black rounded-2xl tracking-[0.3em] uppercase text-xs hover:bg-gold-hover hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50"
        >
          {rsvpMutation.isPending ? 'Processing...' : featuredEvent.seats_remaining <= 0 ? 'Full' : 'RSVP Now'}
        </button>
      </motion.div>
    </section>
  );
}
