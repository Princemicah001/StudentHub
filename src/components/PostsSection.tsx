import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowUpRight, Loader2 } from 'lucide-react';
import { usePosts, type Post } from '@/hooks/usePosts';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function PostsSection() {
  const { data: posts, isLoading } = usePosts();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('posts-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          queryClient.setQueryData<Post[]>(['posts'], (old) => {
            if (!old) return old;
            if (payload.eventType === 'INSERT') {
              const newPost = payload.new as Post;
              if (newPost.published) return [newPost, ...old];
              return old;
            }
            if (payload.eventType === 'UPDATE') {
              const updatedPost = payload.new as Post;
              if (!updatedPost.published) return old.filter(p => p.id !== updatedPost.id);
              const exists = old.find(p => p.id === updatedPost.id);
              if (exists) {
                return old.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p);
              } else {
                return [updatedPost, ...old].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              }
            }
            if (payload.eventType === 'DELETE') {
              return old.filter(p => p.id !== payload.old.id);
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
    <section className="px-6 lg:px-24 py-32 border-t border-white/5">
      <div className="flex justify-between items-end mb-20">
        <div>
          <p className="text-white/40 font-mono tracking-widest text-[10px] mb-6 uppercase">Category: Intelligence / News Feed</p>
          <h2 className="text-5xl font-serif text-white leading-tight">Published Insights.</h2>
        </div>
        <button className="text-gold font-bold tracking-widest uppercase text-xs hover:underline underline-offset-8 transition-all">
          Archive
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
           <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(posts || []).slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass p-10 rounded-[40px] border-white/5 hover:border-gold/20 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-gold transition-colors">
                  <FileText size={20} />
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-mono tracking-widest text-white/40 uppercase group-hover:bg-gold/10 group-hover:text-gold transition-all">
                  Intelligence
                </div>
              </div>

              <h3 className="text-2xl font-serif text-white mb-6 leading-tight group-hover:text-gold transition-colors">{post.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-12 flex-grow line-clamp-3">{post.content}</p>

              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
                  {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </p>
                <ArrowUpRight size={16} className="text-white/20 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </motion.div>
          ))}
          {!isLoading && posts?.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-[40px] border-white/5">
              <p className="text-white/20 font-serif italic text-xl">The intelligence buffer is currently empty.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
