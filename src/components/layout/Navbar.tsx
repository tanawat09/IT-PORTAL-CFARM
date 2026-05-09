import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Monitor, Sun, Moon, Phone, LogIn, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-[100] px-3 pt-3 md:px-6">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-[1.75rem] border border-white/80 bg-white/68 px-4 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.28)] backdrop-blur-2xl md:px-6">
        <Link to="/" className="group flex items-center gap-3 text-slate-900 transition-colors hover:text-primary">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 p-2.5 shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
            <Monitor className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-2xl font-extrabold tracking-tight">IT PORTAL</span>
            <span className="text-[10px] font-bold tracking-[0.32em] text-slate-400">CHUWIT FARM</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-orange-100 bg-orange-50/80 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-700 lg:flex">
            <Sparkles className="h-3.5 w-3.5" />
            Unified Workspace
          </div>

          <Button variant="ghost" size="sm" asChild className="rounded-full px-4 font-bold text-slate-600 hover:bg-orange-50 hover:text-primary">
            <Link to="/contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden text-xs uppercase tracking-widest md:inline">ติดต่อ IT</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 md:block"></div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 overflow-hidden rounded-2xl border border-slate-100 p-0 shadow-sm transition-all hover:border-primary/50">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-emerald-500 text-sm font-black text-white">
                      {profile?.full_name?.charAt(0) || <User className="h-4 w-4" />}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-60 rounded-2xl border-slate-100 p-2 shadow-2xl">
                <div className="mb-1 border-b border-slate-50 px-3 py-3">
                  <p className="font-extrabold text-slate-900">{profile?.full_name || 'ผู้ใช้งาน'}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-tighter text-slate-400">{profile?.email}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                  <Link to="/profile" className="flex items-center gap-3 font-bold text-slate-600">
                    <User className="h-4 w-4 text-primary" />
                    <span>โปรไฟล์ของฉัน</span>
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                    <Link to="/admin" className="flex items-center gap-3 font-bold text-slate-600">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>จัดการระบบ (Admin)</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <div className="mt-1 border-t border-slate-50 pt-1">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-3 rounded-xl py-2.5 font-bold text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" className="rounded-full bg-slate-950 px-6 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-primary hover:shadow-primary/30" asChild>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
