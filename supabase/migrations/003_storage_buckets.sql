-- Migration: 003_storage_buckets.sql
-- Deskripsi: Membuat public buckets untuk menyimpan gambar aplikasi Guyub.

-- 1. Membuat Bucket UMKM (Gambar Produk/Toko)
INSERT INTO storage.buckets (id, name, public)
VALUES ('umkm', 'umkm', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Membuat Bucket Profil (Foto Profil Warga)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Membuat Bucket Artikel/Pengumuman (Gambar Berita)
INSERT INTO storage.buckets (id, name, public)
VALUES ('artikel', 'artikel', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SETUP ROW LEVEL SECURITY (RLS) FOR STORAGE
-- ==========================================

-- Pastikan RLS menyala untuk objects
-- (Di Supabase secara default sudah menyala, jadi ALTER TABLE dihapus untuk menghindari error "must be owner")

-- 1. RLS untuk Bucket UMKM
-- Warga bisa melihat (download) semua gambar UMKM
CREATE POLICY "Public Access UMKM Images" ON storage.objects FOR SELECT 
USING (bucket_id = 'umkm');

-- Hanya warga yang login yang bisa upload ke bucket UMKM
CREATE POLICY "Authenticated users can upload UMKM images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'umkm' AND auth.role() = 'authenticated');

-- 2. RLS untuk Bucket Profil
-- Warga bisa melihat foto profil
CREATE POLICY "Public Access Profile Images" ON storage.objects FOR SELECT 
USING (bucket_id = 'profiles');

-- Warga yang login bisa upload foto profilnya sendiri
CREATE POLICY "Authenticated users can upload Profile images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');

-- 3. RLS untuk Bucket Artikel
-- Semua orang bisa melihat gambar artikel
CREATE POLICY "Public Access Artikel Images" ON storage.objects FOR SELECT 
USING (bucket_id = 'artikel');

-- Hanya warga yang login (nanti admin diverifikasi di aplikasi) yang bisa upload gambar artikel
CREATE POLICY "Authenticated users can upload Artikel images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'artikel' AND auth.role() = 'authenticated');
