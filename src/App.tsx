/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Lenis from 'lenis';
import { supabase } from '@/lib/supabase';

import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import LiveTicker from './components/LiveTicker';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventSpotlight from './components/EventSpotlight';
import MarketplaceHighlights from './components/MarketplaceHighlights';
import VaultCTA from './components/VaultCTA';
import PostsSection from './components/PostsSection';
import GalleryStrip from './components/GalleryStrip';
import Vault from './components/Vault';
import Marketplace from './components/Marketplace';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [location] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const hideFooterAndNav = location === '/login' || location === '/admin';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-obsidian selection:bg-gold/30 selection:text-white overflow-x-hidden pt-8">
        <CustomCursor />
        <NoiseOverlay />
        {!hideFooterAndNav && <LiveTicker />}
        {!hideFooterAndNav && <Navbar />}

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminDashboard} />
          
          <Route path="/">
            <>
              <Hero />
              <EventSpotlight />
              <MarketplaceHighlights />
              <VaultCTA />
              <PostsSection />
              <GalleryStrip />
            </>
          </Route>
          
          <Route path="/marketplace">
            <Marketplace />
          </Route>

          <Route path="/vault">
            <Vault />
          </Route>

          <Route path="/events">
            <div className="min-h-screen flex items-center justify-center pt-24">
              <div className="text-center">
                <h2 className="text-6xl font-serif text-white mb-4 uppercase tracking-tighter italic">Events</h2>
                <p className="text-white/40 font-bold tracking-[0.3em] uppercase text-xs">Coming Soon to the Gavel</p>
              </div>
            </div>
          </Route>

          {/* Fallback */}
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-4xl font-serif italic uppercase text-white/20">404 - Chamber Sealed</h1>
            </div>
          </Route>
        </Switch>

        {!hideFooterAndNav && <Footer />}
        <Toaster position="top-right" theme="dark" closeButton />
      </div>
    </QueryClientProvider>
  );
}
