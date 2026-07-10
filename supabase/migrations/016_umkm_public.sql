-- ============================================================
-- Migration 016: Fitur Pendaftaran UMKM Publik (Tanpa Login)
-- ============================================================

-- 1. Mengubah kolom owner_id agar menjadi opsional (nullable)
ALTER TABLE public.umkm ALTER COLUMN owner_id DROP NOT NULL;

-- 2. Menambahkan kolom nama_pemilik untuk UMKM yang didaftarkan tanpa login
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS nama_pemilik VARCHAR(255);

-- 3. Membuat kebijakan RLS baru untuk mengizinkan publik (anon) menambahkan UMKM
--    Kita pastikan kebijakan ini ada sehingga siapapun bisa submit form UMKM
DROP POLICY IF EXISTS "Users can create UMKM." ON public.umkm;
CREATE POLICY "Users can create UMKM." ON public.umkm FOR INSERT WITH CHECK (true);

-- 4. Membuat Bucket Storage khusus untuk logo/foto UMKM
INSERT INTO storage.buckets (id, name, public)
VALUES ('umkm_logo', 'umkm_logo', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Menambahkan RLS Policy untuk Bucket umkm_logo
DROP POLICY IF EXISTS "Public Access UMKM Logo" ON storage.objects;
CREATE POLICY "Public Access UMKM Logo" ON storage.objects
  FOR SELECT USING (bucket_id = 'umkm_logo');

DROP POLICY IF EXISTS "Anyone can upload UMKM Logo" ON storage.objects;
CREATE POLICY "Anyone can upload UMKM Logo" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'umkm_logo');

DROP POLICY IF EXISTS "Admin can manage UMKM Logo" ON storage.objects;
CREATE POLICY "Admin can manage UMKM Logo" ON storage.objects
  FOR ALL USING (bucket_id = 'umkm_logo' AND auth.role() = 'authenticated');
