import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { SystemCard } from '@/components/SystemCard';
import { LayoutGrid, Star, Activity } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  logo_url: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
}

interface FavoriteRow {
  system_link_id: string;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const [links, setLinks] = useState<SystemLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    const [linksRes, catsRes, annRes, favsRes] = await Promise.all([
      supabase.from('system_links').select('*').eq('is_active', true).order('order', { ascending: true }),
      supabase.from('categories').select('*').order('order', { ascending: true }),
      supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      user ? supabase.from('favorites').select('system_link_id').eq('user_id', user.id) : Promise.resolve({ data: [] as FavoriteRow[] }),
    ]);

    if (linksRes.data) setLinks(linksRes.data as SystemLink[]);
    if (catsRes.data) setCategories(catsRes.data as Category[]);
    if (annRes.data) setAnnouncements(annRes.data as Announcement[]);
    if (favsRes.data) setFavorites((favsRes.data as FavoriteRow[]).map((f) => f.system_link_id));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleFavorite = async (linkId: string, isFavorite: boolean) => {
    if (!user) return;

    if (isFavorite) {
      setFavorites((prev) => prev.filter((id) => id !== linkId));
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('system_link_id', linkId);
    } else {
      setFavorites((prev) => [...prev, linkId]);
      await supabase.from('favorites').insert({ user_id: user.id, system_link_id: linkId });
    }
  };

  const favoriteLinks = links.filter((link) => favorites.includes(link.id));

  const displayedLinks = activeTab === 'favorites'
    ? favoriteLinks
    : activeTab === 'all'
      ? links
      : links.filter((link) => link.category_id === activeTab);

  useEffect(() => {
    if (activeTab === 'favorites' && (!user || favoriteLinks.length === 0)) {
      setActiveTab('all');
    }
  }, [activeTab, favoriteLinks.length, user]);

  useEffect(() => {
    if (user && favoriteLinks.length > 0) {
      setActiveTab('favorites');
      return;
    }

    setActiveTab('all');
  }, [user, favoriteLinks.length]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <p className="font-medium text-slate-400">กำลังโหลดข้อมูลระบบ...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 pb-24">
      <div className="relative z-10 space-y-10">
        <AnimatePresence>
          {announcements.length > 0 && (
            <div className="grid gap-4">
              {announcements.map((ann) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert className="ambient-panel relative overflow-hidden rounded-[2rem] border-white/80 px-6 py-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.22)]">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-emerald-500"></div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-orange-50 p-3 text-primary shadow-sm">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <AlertTitle className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          System Announcement
                        </AlertTitle>
                        <AlertDescription className="text-lg font-bold text-slate-700">
                          {ann.title}: <span className="font-medium text-slate-500">{ann.content}</span>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="flex h-auto max-w-full flex-wrap justify-center gap-2 rounded-[1.8rem] border border-white/80 bg-white/65 p-2 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.22)] backdrop-blur-xl">
              {user && (
                <TabsTrigger value="favorites" className="rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] transition-all data-[state=active]:bg-slate-950 data-[state=active]:text-white data-[state=active]:shadow-sm md:px-8">
                  <Star className="mr-2 h-3 w-3" /> Favorites
                </TabsTrigger>
              )}
              <TabsTrigger value="all" className="rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] transition-all data-[state=active]:bg-slate-950 data-[state=active]:text-white data-[state=active]:shadow-sm md:px-8">
                <LayoutGrid className="mr-2 h-3 w-3" /> All Systems
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] transition-all data-[state=active]:bg-slate-950 data-[state=active]:text-white data-[state=active]:shadow-sm md:px-8">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {displayedLinks.map((link, idx) => (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <SystemCard
                    {...link}
                    logoUrl={link.logo_url}
                    isFavorite={favorites.includes(link.id)}
                    onToggleFavorite={handleToggleFavorite}
                    isLoggedIn={!!user}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayedLinks.length === 0 && (
            <div className="ambient-panel rounded-[2rem] px-8 py-12 text-center text-slate-500">
              {activeTab === 'favorites'
                ? 'ยังไม่มีรายการโปรด'
                : 'ยังไม่มีลิงก์ในหมวดหมู่นี้'}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
