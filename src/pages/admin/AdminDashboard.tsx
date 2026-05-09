import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree, Link as LinkIcon, Users, Megaphone } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    links: 0,
    users: 0,
    announcements: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [cats, links, users, anns] = await Promise.all([
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('system_links').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('announcements').select('id', { count: 'exact' }),
    ]);

    setStats({
      categories: cats.count || 0,
      links: links.count || 0,
      users: users.count || 0,
      announcements: anns.count || 0,
    });
  };

  const statCards = [
    { title: 'หมวดหมู่ทั้งหมด', value: stats.categories, icon: FolderTree, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'ระบบทั้งหมด', value: stats.links, icon: LinkIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'ผู้ใช้งาน', value: stats.users, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'ประกาศ', value: stats.announcements, icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ภาพรวมระบบ</h1>
        <p className="text-muted-foreground">สถิติข้อมูลต่างๆ ในระบบ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
