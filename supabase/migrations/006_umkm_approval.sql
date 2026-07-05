-- Migrasi 006: Ubah default is_approved UMKM menjadi false
-- File: supabase/migrations/006_umkm_approval.sql

-- Mengubah default value agar setiap UMKM baru harus disetujui admin
ALTER TABLE public.umkm 
ALTER COLUMN is_approved SET DEFAULT false;

-- Data lama yang is_approved-nya NULL kita set ke true agar aman (sebagai legacy data)
UPDATE public.umkm SET is_approved = true WHERE is_approved IS NULL;
