import { motion } from 'motion/react';
import { Gavel, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 lg:px-24 py-24 border-t border-white/5 bg-obsidian flex flex-col items-center justify-center text-center">
      <h2 className="text-gold font-serif text-3xl tracking-widest uppercase mb-4">THE MODERN GAVEL</h2>
      <p className="font-mono text-[9px] text-white/10 tracking-[0.5em] uppercase">Authority • Integrity • Exclusivity</p>
      
      <div className="mt-24 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-4">
        <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">© 2026 MKU Law Platform — Developed for the Elite</p>
      </div>
    </footer>
  );
}
