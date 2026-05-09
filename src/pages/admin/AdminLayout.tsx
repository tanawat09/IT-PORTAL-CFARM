import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Link as LinkIcon, FolderTree, Megaphone } from 'lucide-react';

export function AdminLayout() {
  const { profile } = useAuthStore();
  const location = useLocation();

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: 'ภาพรวม', path: '/admin', icon: LayoutDashboard },
    { name: 'จัดการหมวดหมู่', path: '/admin/categories', icon: FolderTree },
    { name: 'จัดการระบบ', path: '/admin/links', icon: LinkIcon },
    { name: 'จัดการประกาศ', path: '/admin/announcements', icon: Megaphone },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-card rounded-xl border shadow-sm p-4 sticky top-20">
          <h2 className="font-semibold text-lg mb-4 px-2">ผู้ดูแลระบบ</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
