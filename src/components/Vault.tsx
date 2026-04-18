import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Lock, CheckCircle2, ShieldCheck, Fingerprint, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVault } from '@/hooks/useVault';
import { toast } from 'sonner';

export default function Vault() {
  const [text, setText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useVault();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    mutation.mutate({ content: text }, {
      onSuccess: () => {
        setIsSubmitted(true);
        setText('');
        setTimeout(() => setIsSubmitted(false), 5000);
      },
      onError: (err) => {
        toast.error('Encryption failed', {
          description: (err as any).message || 'Could not securely submit to the vault.'
        });
      }
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-24 py-32 overflow-hidden bg-obsidian">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(180,78,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-6xl w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Main Content (L: 7) */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 mb-16"
          >
            <div className="w-16 h-16 rounded-[24px] bg-violet/10 border border-violet/20 shadow-[0_0_30px_rgba(180,78,255,0.2)] flex items-center justify-center text-violet">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-[clamp(48px,5vw,72px)] font-serif text-white uppercase tracking-tighter leading-none mb-2">The Vault</h2>
              <p className="text-violet font-mono tracking-[0.4em] uppercase text-[10px]">Speak without consequence</p>
            </div>
          </motion.div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1000))}
              disabled={isSubmitting || isSubmitted}
              placeholder="Tell us something you wouldn't say in person..."
              className={cn(
                "w-full bg-black/40 border border-white/5 p-12 rounded-[40px] text-2xl lg:text-4xl font-serif focus:ring-1 focus:ring-violet/30 focus:border-violet/30 placeholder:text-white/5 min-h-[450px] resize-none transition-all duration-700 glass outline-none",
                (isSubmitting || isSubmitted) && "opacity-0 scale-95 blur-2xl pointer-events-none"
              )}
            />
            
            <span className="absolute bottom-10 left-12 font-mono text-[9px] text-white/20 tracking-widest uppercase">
              {text.length} / 1000
            </span>

            <AnimatePresence>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex flex-col items-center gap-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-2 border-violet border-t-transparent rounded-full shadow-[0_0_40px_rgba(180,78,255,0.4)]"
                    />
                    <span className="text-violet font-mono tracking-[0.6em] uppercase text-[10px] animate-pulse">Encrypting Submission...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex flex-col items-center gap-6 text-center glass p-16 rounded-[48px] border-violet/30">
                    <div className="w-24 h-24 rounded-full bg-violet/20 flex items-center justify-center text-violet mb-4 shadow-[0_0_60px_rgba(180,78,255,0.4)]">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-4xl font-serif text-white">Received.</h3>
                    <p className="text-white/40 max-w-sm text-sm leading-relaxed mb-8">Your frequency has been absorbed into the collective vault. Securely.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-violet hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all pointer-events-auto underline underline-offset-8 decoration-violet-500/30"
                    >
                      Submit Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted || !text.trim()}
              className={cn(
                "group relative px-16 py-6 bg-violet text-white font-black rounded-2xl overflow-hidden transition-all duration-500 text-xs tracking-[0.3em] uppercase shadow-[0_20px_40px_rgba(138,43,226,0.3)]",
                (isSubmitting || isSubmitted || !text.trim()) ? "opacity-50 cursor-not-allowed" : "hover:bg-violet-deep hover:scale-105 active:scale-95"
              )}
            >
              <span className="relative z-10 flex items-center gap-4">
                {isSubmitting ? "Processing..." : "Submit Anonymously"}
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Security Panel (R: 5) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-10 rounded-[40px] border-white/5"
          >
            <h4 className="text-white font-serif text-2xl mb-12">Security Protocol</h4>
            
            <div className="space-y-8">
              {[
                { icon: EyeOff, title: "Identity Shield", desc: "No IP addresses, cookies, or device IDs are ever stored or logged." },
                { icon: ShieldCheck, title: "E2E Encryption", desc: "Submissions are hashed and encrypted before hitting our secure clusters." },
                { icon: Fingerprint, title: "Meta-Scrub", desc: "Our system automatically strips all metadata from each transmission." },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-violet">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="text-white font-semibold text-sm">{item.title}</h5>
                      <CheckCircle2 size={12} className="text-green-500" />
                    </div>
                    <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-12 border-t border-white/5 flex flex-col items-center">
              <p className="font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase mb-4 text-center">Protocol Version: 4.2-GA</p>
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-mono text-white/20 border border-white/10">STRICT_MODE</div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-mono text-white/20 border border-white/10">ZERO_LOGS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
