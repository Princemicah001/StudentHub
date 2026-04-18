import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useGalleryImages, type GalleryImage } from '@/hooks/useGallery';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function GalleryStrip() {
  const { data: images, isLoading } = useGalleryImages();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('gallery-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery_images' },
        (payload) => {
          queryClient.setQueryData<GalleryImage[]>(['gallery'], (old) => {
            if (!old) return old;
            if (payload.eventType === 'INSERT') return [payload.new as GalleryImage, ...old];
            if (payload.eventType === 'UPDATE') {
              return old.map(img => img.id === payload.new.id ? { ...img, ...payload.new } : img);
            }
            if (payload.eventType === 'DELETE') {
              return old.filter(img => img.id !== payload.old.id);
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

  return (
    <section className="py-24 border-t border-white/5">
      <div className="px-6 lg:px-24 flex justify-between items-center mb-12">
        <p className="text-white/40 font-mono tracking-widest text-[10px] uppercase">Category: Gallery / Platform Moments</p>
        <a href="/gallery" className="text-gold flex items-center gap-2 font-bold tracking-widest uppercase text-xs hover:gap-4 transition-all">
          View all
          <ArrowRight size={14} />
        </a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {(images || []).slice(0, 6).map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square relative overflow-hidden group cursor-pointer"
            >
              <img 
                src={img.image_url} 
                alt="Moment" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
          {!isLoading && images?.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-2xl mx-12 border-white/5">
              <p className="text-white/20 font-serif italic text-sm">The gallery buffer is currently vacant.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
