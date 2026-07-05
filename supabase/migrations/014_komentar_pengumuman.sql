-- Migration 014: Komentar & Views untuk Berita/Pengumuman

-- 1. Tambah kolom views ke tabel pengumuman
ALTER TABLE public.pengumuman
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS penyelenggara VARCHAR(255) DEFAULT 'Pengurus RW';

-- 2. Buat tabel komentar_pengumuman
CREATE TABLE IF NOT EXISTS public.komentar_pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pengumuman_id UUID REFERENCES public.pengumuman(id) ON DELETE CASCADE NOT NULL,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  isi TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'disetujui', 'ditolak'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS untuk komentar
ALTER TABLE public.komentar_pengumuman ENABLE ROW LEVEL SECURITY;

-- Siapapun bisa melihat komentar yang sudah disetujui
CREATE POLICY "Approved comments viewable by everyone"
  ON public.komentar_pengumuman FOR SELECT
  USING (status = 'disetujui');

-- Siapapun bisa insert komentar baru (masuk sebagai pending)
CREATE POLICY "Anyone can submit a comment"
  ON public.komentar_pengumuman FOR INSERT
  WITH CHECK (status = 'pending');

-- 4. Fungsi untuk increment views secara aman dari concurrency
CREATE OR REPLACE FUNCTION increment_views(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.pengumuman
  SET views = COALESCE(views, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
