import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldAlert, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Access Granted. Welcome to the Chambers.');
      setLocation('/');
    } catch (err: any) {
      toast.error('Authentication Failed', {
        description: 'Identity not recognized in our secure registry.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-obsidian relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg glass p-12 lg:p-20 rounded-[48px] border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 rounded-[28px] bg-gold/10 flex items-center justify-center text-gold mb-8 border border-gold/20 shadow-[0_0_40px_rgba(255,215,0,0.15)]"
          >
            <Fingerprint size={36} />
          </motion.div>
          <h2 className="text-5xl font-serif text-white mb-4 uppercase tracking-tighter italic">MKU Chambers</h2>
          <p className="text-gold font-mono tracking-[0.4em] uppercase text-[9px]">Identity Verification Protocol</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-4">
            <div className="group relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                type="email"
                required
                placeholder="Institutional Identifier (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white font-serif text-lg placeholder:text-white/10 focus:border-gold/30 focus:bg-white/[0.08] transition-all outline-none"
              />
            </div>
            <div className="group relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                type="password"
                required
                placeholder="Secure Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white font-serif text-lg placeholder:text-white/10 focus:border-gold/30 focus:bg-white/[0.08] transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-white/20 group-hover:border-gold transition-colors flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-sm opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
              </div>
              <input type="checkbox" className="hidden" />
              <span className="text-[10px] font-mono tracking-widest text-white/20 uppercase">Remember Identity</span>
            </label>
            <button type="button" className="text-gold font-mono text-[9px] tracking-widest uppercase hover:underline underline-offset-8">Forgot Key?</button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-gold text-obsidian font-black rounded-[24px] flex items-center justify-center gap-4 hover:bg-gold-hover hover:scale-[1.02] transform transition-all disabled:opacity-50 shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
          >
            <span className="text-xs tracking-[0.4em] uppercase">
              {isLoading ? 'Decrypting...' : 'Initiate Access'}
            </span>
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-white/10 font-mono text-[8px] tracking-[0.4em] uppercase">
            <ShieldAlert size={12} />
            Protected by Gavel Shield™
          </div>
          <div className="flex gap-8">
             <button className="text-white/20 hover:text-gold font-mono text-[9px] tracking-widest uppercase transition-colors">Request Access</button>
             <button className="text-white/20 hover:text-gold font-mono text-[9px] tracking-widest uppercase transition-colors">Help Desk</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
