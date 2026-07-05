-- Migrasi 005: Menambahkan Kolom Penyelenggara/Lembaga
-- File: supabase/migrations/005_lembaga_schema.sql

-- Tambahkan kolom penyelenggara di tabel kegiatan
ALTER TABLE public.kegiatan 
ADD COLUMN IF NOT EXISTS penyelenggara VARCHAR(100) DEFAULT 'Pengurus RW';

-- Tambahkan kolom penyelenggara di tabel pengumuman
ALTER TABLE public.pengumuman 
ADD COLUMN IF NOT EXISTS penyelenggara VARCHAR(100) DEFAULT 'Pengurus RW';

-- (Opsional tapi disarankan) Update data lama yang mungkin belum ada penyelenggaranya
UPDATE public.kegiatan SET penyelenggara = 'Pengurus RW' WHERE penyelenggara IS NULL;
UPDATE public.pengumuman SET penyelenggara = 'Pengurus RW' WHERE penyelenggara IS NULL;
