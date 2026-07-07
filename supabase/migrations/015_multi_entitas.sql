-- Migration 015: Multi-Entity Segmentation

-- 1. Create profil_rt table
CREATE TABLE IF NOT EXISTS public.profil_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_rt VARCHAR(3) UNIQUE NOT NULL,
  ketua_nama VARCHAR(255) NOT NULL,
  ketua_foto_url TEXT,
  sambutan TEXT,
  visi_misi TEXT,
  kontak VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profil_rt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profil RT viewable by everyone"
  ON public.profil_rt FOR SELECT USING (true);

CREATE POLICY "Admin can manage profil RT"
  ON public.profil_rt FOR ALL USING (public.is_admin());

-- 2. Modify kas table to support entitas
ALTER TABLE public.kas ADD COLUMN IF NOT EXISTS entitas_type VARCHAR(20) DEFAULT 'RW' CHECK (entitas_type IN ('RW', 'RT', 'Lembaga'));
ALTER TABLE public.kas ADD COLUMN IF NOT EXISTS entitas_id VARCHAR(50) DEFAULT 'RW';

-- 3. Modify kegiatan table to support penyelenggara
ALTER TABLE public.kegiatan ADD COLUMN IF NOT EXISTS penyelenggara_type VARCHAR(20) DEFAULT 'RW' CHECK (penyelenggara_type IN ('RW', 'RT', 'Lembaga'));
ALTER TABLE public.kegiatan ADD COLUMN IF NOT EXISTS penyelenggara_id VARCHAR(50) DEFAULT 'RW';
