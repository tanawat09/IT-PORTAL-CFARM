import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Wrench, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactIT() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ติดต่อแผนก IT</h1>
        <p className="text-muted-foreground mt-2">ช่องทางการติดต่อและแจ้งปัญหาการใช้งาน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>ระบบแจ้งซ่อม IT</CardTitle>
            <CardDescription>แจ้งปัญหาอุปกรณ์หรือระบบผ่านระบบ Ticket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ยังไม่ได้ตั้งค่า URL ของระบบ Ticket ในโปรเจ็กต์นี้
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  ไปหน้า Portal รวมลิงก์ <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>เบอร์ติดต่อภายใน</CardTitle>
            <CardDescription>โทรศัพท์สายตรงแผนก IT</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">เบอร์ต่อ: 112, 113</p>
            <p className="text-sm text-muted-foreground">เวลาทำการ: จันทร์ - ศุกร์ 08:00 - 17:00 น.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>Line Official / Group</CardTitle>
            <CardDescription>ติดต่อสอบถามผ่าน Line</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">@IT_Support</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>อีเมล</CardTitle>
            <CardDescription>ส่งอีเมลแจ้งปัญหาหรือสอบถามข้อมูล</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:it@company.com" className="text-primary hover:underline font-medium">
              it@company.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Just a small helper since I used ExternalLink
function ExternalLink({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
