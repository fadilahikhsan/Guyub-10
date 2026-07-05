-- Guyub Database Schema v1
-- Tabel ini digunakan untuk inisialisasi awal database Supabase.

-- Ekstensi UUID untuk auto-generate id
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Profil Warga (Terhubung ke Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  rt VARCHAR(3) NOT NULL,
  rw VARCHAR(3) DEFAULT '01',
  role VARCHAR(50) DEFAULT 'warga', -- 'warga' atau 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan Row Level Security (RLS) untuk profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Profiles: Warga bisa melihat semua profil, tapi hanya bisa mengedit miliknya sendiri
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Tabel UMKM
CREATE TABLE public.umkm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nama_usaha VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) NOT NULL, -- 'makanan', 'jasa', 'lainnya'
  deskripsi TEXT,
  nomor_wa VARCHAR(20) NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;
CREATE POLICY "UMKM are viewable by everyone." ON public.umkm FOR SELECT USING (true);
CREATE POLICY "Users can create UMKM." ON public.umkm FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 3. Tabel Pengajuan Surat
CREATE TABLE public.surat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  jenis_surat VARCHAR(100) NOT NULL,
  keperluan TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'diproses', 'selesai', 'ditolak'
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.surat ENABLE ROW LEVEL SECURITY;
-- Hanya pembuat yang bisa melihat suratnya, kecuali admin (nanti diatur via auth helper)
CREATE POLICY "Users view own surat." ON public.surat FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own surat." ON public.surat FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Tabel Pengumuman
CREATE TABLE public.pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  konten TEXT NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pengumuman viewable by everyone." ON public.pengumuman FOR SELECT USING (true);
-- Insert/Update hanya untuk admin, dilakukan melalui verifikasi aplikasi.
