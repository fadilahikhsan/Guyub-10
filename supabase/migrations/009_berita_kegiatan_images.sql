-- Migration 009: Penambahan fitur gambar untuk Berita (Pengumuman) & Kegiatan

-- 1. Tambah kolom foto_url di pengumuman (Berita)
ALTER TABLE public.pengumuman ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 2. Tambah kolom foto_url di kegiatan
ALTER TABLE public.kegiatan ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 3. Bikin Bucket untuk 'berita'
INSERT INTO storage.buckets (id, name, public)
VALUES ('berita', 'berita', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Bikin Bucket untuk 'kegiatan'
INSERT INTO storage.buckets (id, name, public)
VALUES ('kegiatan', 'kegiatan', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies (Berita)
CREATE POLICY "Public Access Berita Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'berita');
CREATE POLICY "Admin can upload Berita images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'berita' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete Berita images" ON storage.objects
  FOR DELETE USING (bucket_id = 'berita' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can update Berita images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'berita' AND auth.role() = 'authenticated');

-- 6. Storage RLS Policies (Kegiatan)
CREATE POLICY "Public Access Kegiatan Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'kegiatan');
CREATE POLICY "Admin can upload Kegiatan images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'kegiatan' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete Kegiatan images" ON storage.objects
  FOR DELETE USING (bucket_id = 'kegiatan' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can update Kegiatan images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'kegiatan' AND auth.role() = 'authenticated');
