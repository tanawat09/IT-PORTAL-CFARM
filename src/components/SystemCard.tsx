import { Star, ArrowRight, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SystemCardProps {
  id: string;
  title: string;
  description: string | null;
  url: string;
  logoUrl: string | null;
  icon?: string | null;
  isFavorite: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function SystemCard({
  id,
  title,
  description,
  url,
  logoUrl,
  isFavorite,
  isLoggedIn,
  onToggleFavorite,
}: SystemCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);
  const hologramX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const hologramY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
    >
      <div className="absolute -inset-2 rounded-[2.75rem] bg-gradient-to-br from-orange-100/80 via-transparent to-emerald-100/60 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100"></div>

      <Card className="relative flex h-full flex-col overflow-hidden rounded-[2.3rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,240,0.92))] shadow-[0_18px_55px_-24px_rgba(15,23,42,0.2)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_-24px_rgba(249,115,22,0.28)]">
        <motion.div
          style={{ backgroundPosition: `${hologramX} ${hologramY}` }}
          className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(135deg,transparent_22%,rgba(255,255,255,0.55)_46%,rgba(255,255,255,0.95)_50%,rgba(255,255,255,0.55)_54%,transparent_78%)] bg-[length:200%_200%] opacity-0 transition-opacity duration-700 group-hover:opacity-40"
        />

        <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
          <span>Portal Link</span>
          <span>{isFavorite ? 'Saved' : 'Ready'}</span>
        </div>

        <div className="relative z-20 flex h-full flex-col space-y-6 p-8 pt-14">
          <div className="flex items-start justify-between">
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-3 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary"
              style={{ transform: 'translateZ(50px)' }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={title} className="h-full w-full object-contain transition-all group-hover:brightness-0 group-hover:invert" />
              ) : (
                <Target className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
              )}
            </div>

            {isLoggedIn && (
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(id, isFavorite);
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isFavorite
                    ? 'border-yellow-400 bg-yellow-400 text-white shadow-md'
                    : 'border border-slate-100 bg-white/70 text-slate-400 hover:border-yellow-400/50 hover:text-yellow-500'
                }`}
              >
                <Star className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
            )}
          </div>

          <div style={{ transform: 'translateZ(30px)' }} className="space-y-2">
            <h3 className="font-heading text-2xl font-extrabold leading-none tracking-tight text-slate-900 transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="min-h-[44px] line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
              {description || 'ระบบภายในสำหรับการทำงานใน Chuwit Farm พร้อมเข้าใช้งานได้ทันที'}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between rounded-[1.5rem] border border-slate-100/80 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-400" style={{ transform: 'translateZ(40px)' }}>
            <span className="uppercase tracking-[0.24em]">External Access</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Available</span>
          </div>

          <div className="pt-2" style={{ transform: 'translateZ(40px)' }}>
            <Button
              variant="outline"
              className="group/btn h-14 w-full rounded-2xl border-slate-200 bg-slate-950 text-sm font-bold text-white shadow-sm transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                <span>เปิดระบบงาน</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>

        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"></div>
      </Card>
    </motion.div>
  );
}
