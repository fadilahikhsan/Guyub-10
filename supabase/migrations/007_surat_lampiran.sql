-- Migration: 007_surat_lampiran.sql
-- Deskripsi: Menambahkan kolom lampiran_url pada surat dan membuat bucket surat_lampiran

-- 1. Menambahkan kolom lampiran_url pada tabel surat
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS lampiran_url TEXT;

-- 2. Membuat Bucket surat_lampiran (Public untuk bisa dilihat admin via URL, walau idealnya private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('surat_lampiran', 'surat_lampiran', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS untuk Bucket surat_lampiran
-- Warga bisa melihat file surat_lampiran
CREATE POLICY "Public Access Surat Lampiran" ON storage.objects FOR SELECT 
USING (bucket_id = 'surat_lampiran');

-- Hanya warga yang login yang bisa upload ke bucket surat_lampiran
CREATE POLICY "Authenticated users can upload Surat Lampiran" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'surat_lampiran' AND auth.role() = 'authenticated');
