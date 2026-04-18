import React from 'react';
import { motion } from 'motion/react';
import { Home, ShoppingBag, Calendar, Lock } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300",
        active ? "text-gold" : "text-white/40 hover:text-white"
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"
        />
      )}
    </Link>
  );
}

export default function Navbar() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 px-8 py-3 glass rounded-full shadow-2xl border-white/5">
        <NavItem icon={Home} label="Home" href="/" active={location === '/'} />
        <NavItem icon={ShoppingBag} label="Market" href="/marketplace" active={location === '/marketplace'} />
        <NavItem icon={Calendar} label="Events" href="/events" active={location === '/events'} />
        <NavItem icon={Lock} label="Vault" href="/vault" active={location === '/vault'} />
      </div>
    </div>
  );
}
