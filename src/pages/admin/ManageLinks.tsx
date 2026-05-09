import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function ManageLinks() {
  const [links, setLinks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    logo_url: '',
    category_id: '',
    is_active: true,
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [linksRes, catsRes] = await Promise.all([
      supabase.from('system_links').select('*, categories(name)').order('order', { ascending: true }),
      supabase.from('categories').select('*').order('order', { ascending: true }),
    ]);

    if (linksRes.data) setLinks(linksRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  const handleOpenDialog = (link: any = null) => {
    if (link) {
      setEditingId(link.id);
      setFormData({
        title: link.title,
        description: link.description || '',
        url: link.url,
        logo_url: link.logo_url || '',
        category_id: link.category_id || '',
        is_active: link.is_active,
        order: link.order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        logo_url: '',
        category_id: categories[0]?.id || '',
        is_active: true,
        order: links.length + 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        category_id: formData.category_id === 'none' ? null : formData.category_id || null,
      };

      if (editingId) {
        const { error } = await supabase.from('system_links').update(dataToSave).eq('id', editingId);
        if (error) throw error;
        toast.success('อัปเดตระบบสำเร็จ');
      } else {
        const { error } = await supabase.from('system_links').insert(dataToSave);
        if (error) throw error;
        toast.success('เพิ่มระบบสำเร็จ');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบระบบนี้?')) return;
    try {
      const { error } = await supabase.from('system_links').delete().eq('id', id);
      if (error) throw error;
      toast.success('ลบระบบสำเร็จ');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการระบบ (Links)</h1>
          <p className="text-muted-foreground">เพิ่ม ลบ แก้ไข ลิงก์ระบบในพอร์ทัล</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มระบบ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'แก้ไขระบบ' : 'เพิ่มระบบใหม่'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อระบบ</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด (ตัวเลือก)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL โลโก้ (ตัวเลือก)</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>หมวดหมู่</Label>
                <Select
                  value={formData.category_id || 'none'}
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ไม่มีหมวดหมู่</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">ลำดับ</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-input w-4 h-4"
                    />
                    เปิดใช้งาน
                  </Label>
                </div>
              </div>
              <Button type="submit" className="w-full">บันทึก</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ลำดับ</TableHead>
              <TableHead>โลโก้</TableHead>
              <TableHead>ชื่อระบบ</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">กำลังโหลด...</TableCell>
              </TableRow>
            ) : links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">ไม่มีข้อมูลระบบ</TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.order}</TableCell>
                  <TableCell>
                    {link.logo_url ? (
                      <img src={link.logo_url} alt={link.title} className="w-8 h-8 rounded object-contain bg-muted p-1" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {link.title.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      {link.title}
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{link.url}</div>
                  </TableCell>
                  <TableCell>{link.categories?.name || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.is_active ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {link.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(link)}>
                      <Edit2 className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
