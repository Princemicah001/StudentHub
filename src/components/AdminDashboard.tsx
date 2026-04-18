import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Shield, 
  Database, 
  MessageSquare, 
  Settings, 
  LogOut,
  TrendingUp,
  Activity,
  Trash2,
  Search,
  Bell,
  Terminal,
  Layers,
  Calendar,
  Image as ImageIcon,
  Command,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('command');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubmissions(submissions.filter(s => s.id !== id));
      toast.success('System record purged');
    } catch (err: any) {
      toast.error('Purge failed');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex text-white font-sans selection:bg-gold/30">
      {/* Sidebar */}
      <aside 
        className={cn(
          "h-screen sticky top-0 bg-[#070707] border-r border-white/5 flex flex-col transition-all duration-500 z-50",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="p-6 mb-12 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                  <Terminal size={16} />
                </div>
                <span className="font-serif text-sm tracking-widest uppercase italic font-black">Chambers</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all ml-auto"
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'command', icon: Layers, label: 'Command Centre' },
            { id: 'content', icon: Terminal, label: 'Content Machine' },
            { id: 'queue', icon: Activity, label: 'Review Queue' },
            { id: 'vault', icon: MessageSquare, label: 'The Vault' },
            { id: 'media', icon: ImageIcon, label: 'Media Vault' },
            { id: 'access', icon: Shield, label: 'Access Control' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all group",
                activeTab === item.id ? "bg-gold/10 text-gold" : "text-white/20 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn("transition-colors", activeTab === item.id ? "text-gold" : "text-white/20 group-hover:text-white")} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all">
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Terminate</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-8 w-full max-w-xl">
            <div className="relative w-full group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Search commands (Cmd+K)" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-mono tracking-widest outline-none focus:border-gold/30 transition-all placeholder:text-white/10"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                <Command size={10} />
                <span className="text-[10px]">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-obsidian" />
            </button>
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-mono font-black tracking-widest uppercase text-white">Root Access</p>
                <p className="text-[8px] font-mono tracking-widest uppercase text-gold">Level Alpha</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 p-[1px]">
                <div className="w-full h-full rounded-[9px] bg-obsidian flex items-center justify-center">
                  <Users size={16} className="text-gold" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16">
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="text-gold font-mono tracking-[0.4em] uppercase text-[9px] mb-4"
              >
                Environment: Production / Secure
              </motion.p>
              <h1 className="text-6xl font-serif text-white uppercase tracking-tighter italic">Command Centre</h1>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 glass rounded-xl text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-white transition-all">
                Audit Logs
              </button>
              <button className="px-8 py-4 bg-gold text-obsidian font-black rounded-xl text-[10px] font-mono tracking-widest uppercase shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:scale-105 transition-all">
                Initialise Protocol
              </button>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Active Sessions', val: '2,408', icon: Users, color: 'text-gold', trend: '+12%' },
              { label: 'Vault Fragments', val: submissions.length, icon: Database, color: 'text-violet', trend: 'Secure' },
              { label: 'Latency (Avg)', val: '86ms', icon: Activity, color: 'text-emerald-500', trend: 'Nominal' },
              { label: 'Market Index', val: '1.42s', icon: TrendingUp, color: 'text-gold', trend: 'Active' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 glass rounded-[32px] border-white/5 shadow-2xl relative group overflow-hidden"
              >
                <div className="absolute top-6 right-8 text-[9px] font-mono text-white/10 uppercase tracking-widest">{stat.trend}</div>
                <div className={cn("w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8", stat.color)}>
                  <stat.icon size={20} />
                </div>
                <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mb-2">{stat.label}</p>
                <p className="text-4xl font-serif text-white">{stat.val}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Hub & Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass rounded-[40px] border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-serif text-xl">Recent Submissions</h3>
                  <button onClick={fetchSubmissions} className="text-gold font-mono text-[9px] tracking-widest uppercase hover:underline underline-offset-4">Refresh Feed</button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white/20 font-mono text-[9px] tracking-[0.2em] uppercase py-6 px-8">Sequence</TableHead>
                      <TableHead className="text-white/20 font-mono text-[9px] tracking-[0.2em] uppercase py-6 px-8 text-right">Admin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={2} className="text-center py-20 font-mono text-[10px] text-white/20 uppercase tracking-[0.4em] animate-pulse">Decrypting data streams...</TableCell></TableRow>
                    ) : submissions.map((sub) => (
                      <TableRow key={sub.id} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-gold font-mono text-xs">{sub.id.slice(0, 8)}</span>
                              <span className="w-1 h-1 bg-white/10 rounded-full" />
                              <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">{new Date(sub.created_at).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-white/60 text-sm line-clamp-1 max-w-xl pr-12 group-hover:text-white transition-colors">
                              {sub.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          <button 
                            onClick={() => deleteSubmission(sub.id)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all ml-auto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && submissions.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-center py-20 text-white/10 uppercase tracking-[0.4em] font-mono text-[10px]">Zero records in current buffer.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-[40px] border-white/5">
                <h3 className="font-serif text-xl mb-8">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Post News', icon: Terminal },
                    { label: 'Event Hub', icon: Calendar },
                    { icon: Shield, label: 'Review Q' },
                    { icon: Settings, label: 'Sys Config' },
                  ].map((action, i) => (
                    <button key={i} className="flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-gold/30 hover:bg-white/[0.08] transition-all group">
                      <action.icon size={20} className="text-white/20 group-hover:text-gold transition-colors" />
                      <span className="text-[9px] font-mono tracking-widest uppercase text-white/40 group-hover:text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gold/5 p-8 rounded-[40px] border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-gold font-serif text-xl mb-4">System Alerts</h3>
                <p className="text-gold/40 text-xs leading-relaxed mb-6">3 new vendors are awaiting verification in the high-priority queue.</p>
                <button className="text-gold font-mono text-[9px] tracking-[0.3em] uppercase underline underline-offset-8 decoration-gold/30 hover:decoration-gold transition-all">
                  Access Queue
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
