-- Migrasi 004: Skema Tabel Kegiatan Warga
-- Membuat tabel kegiatan untuk fitur Agenda/Kalender
-- File: supabase/migrations/004_kegiatan_schema.sql

CREATE TABLE IF NOT EXISTS public.kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    tanggal TIMESTAMPTZ NOT NULL,
    lokasi TEXT NOT NULL,
    kategori TEXT NOT NULL CHECK (kategori IN ('Pengajian', 'Kerja Bakti', 'Posyandu', 'Karang Taruna', 'Rapat', 'Lainnya')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- (Trigger updated_at dihapus karena kita akan menghandle timestamp dari aplikasi)

-- Enable RLS
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;

-- Warga/Publik hanya bisa MELIHAT kegiatan
CREATE POLICY "Public can view kegiatan" 
ON public.kegiatan FOR SELECT 
USING (true);

-- Hanya ADMIN yang bisa INSERT/UPDATE/DELETE kegiatan
CREATE POLICY "Admin can insert kegiatan" 
ON public.kegiatan FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin can update kegiatan" 
ON public.kegiatan FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin can delete kegiatan" 
ON public.kegiatan FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);
