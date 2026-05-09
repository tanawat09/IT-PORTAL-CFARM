import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageLinks } from './pages/admin/ManageLinks';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageAnnouncements } from './pages/admin/ManageAnnouncements';
import { ContactIT } from './pages/ContactIT';
import { Profile } from './pages/Profile';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { setSession, setUser, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data as any);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes - ไม่ต้อง Login */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="contact" element={<ContactIT />} />
        </Route>

        {/* Admin routes - ต้อง Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/admin" element={<Layout />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="links" element={<ManageLinks />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="announcements" element={<ManageAnnouncements />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}
