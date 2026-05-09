import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">โปรไฟล์ของฉัน</h1>
        <p className="text-muted-foreground mt-2">ข้อมูลส่วนตัวและการตั้งค่า</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary font-semibold overflow-hidden border-4 border-background shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.full_name || 'ผู้ใช้งาน'}</h2>
              <p className="text-muted-foreground capitalize flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" />
                บทบาท: {profile.role}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ-นามสกุล</p>
                <p className="font-medium">{profile.full_name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <Button variant="destructive" onClick={handleLogout}>
              ออกจากระบบ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
