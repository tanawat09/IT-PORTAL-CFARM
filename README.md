# IT Portal Web Application

Web Portal รวมลิงก์ระบบภายในองค์กร สร้างด้วย React, Vite, Tailwind CSS, shadcn/ui และ Supabase

## คุณสมบัติ (Features)
- 🔒 ระบบ Authentication ด้วย Supabase
- 📊 Dashboard แสดงเมนูระบบเป็น Card พร้อมแบ่งหมวดหมู่
- 🔍 ค้นหาระบบจากชื่อหรือรายละเอียด
- ⭐ Favorite ระบบที่ใช้บ่อย
- 👤 หน้า Profile และข้อมูลผู้ใช้
- 📱 Responsive UI รองรับทุกอุปกรณ์
- 🌙 Dark Mode Support
- ⚙️ Admin Panel จัดการหมวดหมู่และลิงก์ระบบ

## เทคโนโลยี (Tech Stack)
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- UI Components: shadcn/ui (Radix UI)
- State Management: Zustand
- Database & Auth: Supabase (PostgreSQL)

## การติดตั้งและการรันโปรเจกต์ (Installation & Running)

1. **Clone หรือเข้าไปที่โฟลเดอร์โปรเจกต์**
   ```bash
   cd it-portal
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Supabase**
   - สมัครบัญชีและสร้าง Project ใหม่ที่ [Supabase](https://supabase.com)
   - ไปที่ `SQL Editor` ใน Supabase Dashboard
   - คัดลอกโค้ดจากไฟล์ `supabase/schema.sql` ไปรันเพื่อสร้าง Tables, RLS Policies และ Seed Data
   - คัดลอก Project URL และ Anon Key จาก Settings > API

4. **ตั้งค่า Environment Variables**
   - คัดลอกไฟล์ `.env.example` เป็น `.env`
   ```bash
   cp .env.example .env
   ```
   - นำค่า URL และ Key ที่ได้จาก Supabase มาใส่ใน `.env`
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **รัน Development Server**
   ```bash
   npm run dev
   ```
   - เปิดเบราว์เซอร์และเข้าไปที่ `http://localhost:5173`

## การสร้าง Admin User
1. สมัครสมาชิก (Sign up) ผ่านหน้าต่างของ Supabase Authentication หรือเพิ่ม User โดยตรงผ่าน Supabase Dashboard > Authentication > Add user
2. ไปที่ Table `profiles` ใน Supabase Database
3. เปลี่ยนค่าในคอลัมน์ `role` ของ User ที่ต้องการจาก `user` เป็น `admin`
4. เมื่อ User นั้นเข้าสู่ระบบ จะเห็นเมนู "จัดการระบบ (Admin)" ปรากฏขึ้นที่มุมขวาบน
