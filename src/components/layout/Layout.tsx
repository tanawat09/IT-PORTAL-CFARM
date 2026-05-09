import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-primary/20 selection:text-slate-950">
      <div className="noise-bg" />
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-30" />
      <div className="pointer-events-none fixed left-[-10%] top-24 h-[28rem] w-[28rem] rounded-full bg-orange-200/30 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-8rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-emerald-200/30 blur-[120px]" />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>

      <footer className="relative z-10 px-4 py-12 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 rounded-[2rem] border border-white/70 bg-white/55 px-6 py-8 text-center shadow-[0_20px_55px_-30px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">
            <span className="h-[1px] w-8 bg-slate-300"></span>
            System Status: Operational
            <span className="h-[1px] w-8 bg-slate-300"></span>
          </div>
          <p className="font-mono-tech text-xs text-slate-500">
            © {new Date().getFullYear()} CHUWIT FARM IT PORTAL v2.0.4.8
          </p>
        </div>
      </footer>
    </div>
  );
}
