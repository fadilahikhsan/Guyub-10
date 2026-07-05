-- ============================================================
-- Migration 008: Phase 3 — Tabel Baru & Perluasan PRD Guyub 10
-- Jalankan di SQL Editor Supabase SETELAH semua migrasi 001-007
-- ============================================================

-- ── 1. TABEL PROFIL_RW ───────────────────────────────────────
-- Data profil RW yang bisa diedit admin (ketua, sekretaris, bendahara, visi, misi, statistik)
CREATE TABLE IF NOT EXISTS public.profil_rw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketua_nama VARCHAR(255) DEFAULT 'Bpk. H. Ahmad Fauzi',
  ketua_foto_url TEXT,
  ketua_sambutan TEXT DEFAULT 'Selamat datang di Portal Digital Guyub RW 10.',
  ketua_wa VARCHAR(20),
  sekretaris_nama VARCHAR(255) DEFAULT 'Bpk. Dedi Kurniawan',
  sekretaris_wa VARCHAR(20),
  bendahara_nama VARCHAR(255) DEFAULT 'Ibu Siti Rahayu',
  bendahara_wa VARCHAR(20),
  sejarah TEXT DEFAULT 'Rukun Warga (RW) 10 terletak di jantung Desa Cicadas, menaungi 4 Rukun Tetangga (RT) yang aktif dan rukun.',
  visi TEXT DEFAULT 'Terwujudnya lingkungan RW 10 yang aman, nyaman, bersih, harmonis, dan mandiri.',
  misi TEXT[] DEFAULT ARRAY[
    'Meningkatkan keamanan dan ketertiban lingkungan.',
    'Mendorong partisipasi aktif seluruh warga.',
    'Memfasilitasi pelayanan administrasi kependudukan.',
    'Meningkatkan taraf ekonomi warga melalui pemberdayaan UMKM.',
    'Menjaga kebersihan dan kelestarian lingkungan.',
    'Membangun komunikasi yang terbuka dan digital melalui Portal Guyub.'
  ],
  jumlah_warga INT DEFAULT 1200,
  jumlah_kk INT DEFAULT 350,
  jumlah_rt INT DEFAULT 4,
  jumlah_masjid INT DEFAULT 2,
  jumlah_lapangan INT DEFAULT 1,
  fasilitas_lain TEXT DEFAULT 'Pos Kamling, Balai Warga, Taman Bermain',
  maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15862.5!2d106.989!3d-6.469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjgnOC40IlMgMTA2wrA1OSczMi40IkU!5e0!3m2!1sen!2sid',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profil_rw ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profil RW viewable by everyone"
  ON public.profil_rw FOR SELECT USING (true);

CREATE POLICY "Admin can manage profil_rw"
  ON public.profil_rw FOR ALL USING (public.is_admin());


-- ── 2. TABEL LEMBAGA ─────────────────────────────────────────
-- Data dinamis setiap RT & Lembaga (slug-based)
CREATE TABLE IF NOT EXISTS public.lembaga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  ketua_nama VARCHAR(255),
  ketua_foto_url TEXT,
  ketua_wa VARCHAR(20),
  sekretaris_nama VARCHAR(255),
  bendahara_nama VARCHAR(255),
  program_kerja TEXT,
  kontak_wa VARCHAR(20),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lembaga ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lembaga viewable by everyone"
  ON public.lembaga FOR SELECT USING (true);

CREATE POLICY "Admin can manage lembaga"
  ON public.lembaga FOR ALL USING (public.is_admin());


-- ── 3. TABEL FASILITAS ───────────────────────────────────────
-- Fasilitas & Sarana RW (bisa dipinjam warga)
CREATE TABLE IF NOT EXISTS public.fasilitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT,
  lokasi TEXT,
  jam_operasional TEXT,
  cara_peminjaman TEXT,
  bisa_dipinjam BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fasilitas viewable by everyone"
  ON public.fasilitas FOR SELECT USING (true);

CREATE POLICY "Admin can manage fasilitas"
  ON public.fasilitas FOR ALL USING (public.is_admin());


-- ── 4. TABEL GALERI ──────────────────────────────────────────
-- Galeri foto dinamis (upload dari admin ke Supabase Storage)
CREATE TABLE IF NOT EXISTS public.galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT NOT NULL,
  album VARCHAR(100) DEFAULT 'umum',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Galeri viewable by everyone"
  ON public.galeri FOR SELECT USING (true);

CREATE POLICY "Admin can manage galeri"
  ON public.galeri FOR ALL USING (public.is_admin());


-- ── 5. TABEL KAS ─────────────────────────────────────────────
-- Laporan keuangan / transparansi kas RW
CREATE TABLE IF NOT EXISTS public.kas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  keterangan TEXT NOT NULL,
  jenis VARCHAR(10) NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  jumlah BIGINT NOT NULL,
  kategori VARCHAR(100) DEFAULT 'umum',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kas viewable by everyone"
  ON public.kas FOR SELECT USING (true);

CREATE POLICY "Admin can manage kas"
  ON public.kas FOR ALL USING (public.is_admin());


-- ── 6. TABEL ASPIRASI ────────────────────────────────────────
-- Papan aspirasi / kotak saran warga (bisa anonim)
CREATE TABLE IF NOT EXISTS public.aspirasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) DEFAULT 'Anonim',
  kategori VARCHAR(100),
  pesan TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'masuk',
  balasan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.aspirasi ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa melihat aspirasi
CREATE POLICY "Aspirasi viewable by everyone"
  ON public.aspirasi FOR SELECT USING (true);

-- Siapapun bisa kirim aspirasi (tanpa login) — menggunakan anon key
CREATE POLICY "Anyone can submit aspirasi"
  ON public.aspirasi FOR INSERT WITH CHECK (true);

-- Hanya admin yang bisa update (balas) dan delete
CREATE POLICY "Admin can update aspirasi"
  ON public.aspirasi FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete aspirasi"
  ON public.aspirasi FOR DELETE USING (public.is_admin());


-- ── 7. TABEL WARGA ───────────────────────────────────────────
-- Database warga lengkap (hanya admin yang bisa akses data penuh)
CREATE TABLE IF NOT EXISTS public.warga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_kk VARCHAR(20),
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  tempat_lahir VARCHAR(100),
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('L', 'P')),
  agama VARCHAR(50),
  status_perkawinan VARCHAR(50),
  pekerjaan VARCHAR(100),
  pendidikan VARCHAR(100),
  rt VARCHAR(3) NOT NULL,
  alamat TEXT,
  status_warga VARCHAR(50) DEFAULT 'aktif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.warga ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang bisa melihat data warga (data sensitif)
CREATE POLICY "Admin can view all warga"
  ON public.warga FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage warga"
  ON public.warga FOR ALL USING (public.is_admin());


-- ── 8. TABEL TICKER ──────────────────────────────────────────
-- Running text / marquee di halaman beranda (dinamis)
CREATE TABLE IF NOT EXISTS public.ticker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  konten TEXT NOT NULL,
  aktif BOOLEAN DEFAULT true,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ticker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ticker viewable by everyone"
  ON public.ticker FOR SELECT USING (true);

CREATE POLICY "Admin can manage ticker"
  ON public.ticker FOR ALL USING (public.is_admin());


-- ── 9. ALTER TABLE: SURAT ────────────────────────────────────
-- Tambah kolom baru sesuai PRD
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS tujuan VARCHAR(50);
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS nik_pemohon VARCHAR(16);
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS nomor_tiket VARCHAR(20) UNIQUE;
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.surat ADD COLUMN IF NOT EXISTS notif_wa_sent BOOLEAN DEFAULT false;


-- ── 10. ALTER TABLE: UMKM ────────────────────────────────────
-- Tambah kolom foto, alamat, jam buka
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS alamat TEXT;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS jam_buka TEXT;


-- ══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════════

-- Bucket: galeri (foto kegiatan, lingkungan, dll)
INSERT INTO storage.buckets (id, name, public)
VALUES ('galeri', 'galeri', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: fasilitas (foto fasilitas & sarana)
INSERT INTO storage.buckets (id, name, public)
VALUES ('fasilitas', 'fasilitas', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: dokumen_surat (PDF surat yang sudah diapprove)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dokumen_surat', 'dokumen_surat', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: profil_rw (foto pengurus RW/RT)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profil_rw', 'profil_rw', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: lembaga (foto pengurus lembaga)
INSERT INTO storage.buckets (id, name, public)
VALUES ('lembaga', 'lembaga', true)
ON CONFLICT (id) DO NOTHING;


-- ── Storage RLS Policies ─────────────────────────────────────

-- Galeri bucket
CREATE POLICY "Public Access Galeri Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'galeri');
CREATE POLICY "Admin can upload Galeri images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'galeri' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete Galeri images" ON storage.objects
  FOR DELETE USING (bucket_id = 'galeri' AND auth.role() = 'authenticated');

-- Fasilitas bucket
CREATE POLICY "Public Access Fasilitas Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'fasilitas');
CREATE POLICY "Admin can upload Fasilitas images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'fasilitas' AND auth.role() = 'authenticated');

-- Dokumen surat bucket
CREATE POLICY "Public Access Dokumen Surat" ON storage.objects
  FOR SELECT USING (bucket_id = 'dokumen_surat');
CREATE POLICY "Admin can upload Dokumen Surat" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dokumen_surat' AND auth.role() = 'authenticated');

-- Profil RW bucket
CREATE POLICY "Public Access Profil RW Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profil_rw');
CREATE POLICY "Admin can upload Profil RW images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profil_rw' AND auth.role() = 'authenticated');

-- Lembaga bucket
CREATE POLICY "Public Access Lembaga Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'lembaga');
CREATE POLICY "Admin can upload Lembaga images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'lembaga' AND auth.role() = 'authenticated');


-- ══════════════════════════════════════════════════════════════
-- TRIGGER: updated_at otomatis
-- ══════════════════════════════════════════════════════════════

-- Reuse fungsi handle_updated_at dari migration 002
DROP TRIGGER IF EXISTS on_profil_rw_updated ON public.profil_rw;
CREATE TRIGGER on_profil_rw_updated
  BEFORE UPDATE ON public.profil_rw
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_lembaga_updated ON public.lembaga;
CREATE TRIGGER on_lembaga_updated
  BEFORE UPDATE ON public.lembaga
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_warga_updated ON public.warga;
CREATE TRIGGER on_warga_updated
  BEFORE UPDATE ON public.warga
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ══════════════════════════════════════════════════════════════
-- SEED DATA
-- ══════════════════════════════════════════════════════════════

-- Seed: 1 row profil_rw (default data, admin edit nanti)
INSERT INTO public.profil_rw (
  ketua_nama, ketua_sambutan, ketua_wa,
  sekretaris_nama, sekretaris_wa,
  bendahara_nama, bendahara_wa,
  sejarah, visi, misi,
  jumlah_warga, jumlah_kk, jumlah_rt, jumlah_masjid, jumlah_lapangan,
  fasilitas_lain, maps_embed_url
) VALUES (
  'Bpk. H. Ahmad Fauzi',
  'Selamat datang di Portal Digital Guyub RW 10. Kami berharap platform ini menjadikan pelayanan warga lebih cepat, transparan, dan mempererat silaturahmi.',
  '081234567890',
  'Bpk. Dedi Kurniawan', '081323456789',
  'Ibu Siti Rahayu', '085787654321',
  'Rukun Warga (RW) 10 terletak di jantung Desa Cicadas, Kecamatan Gunung Putri, Kabupaten Bogor. Menaungi 4 Rukun Tetangga (RT) yang aktif dan rukun. Wilayah ini memiliki luas kurang lebih 15 hektar dengan populasi lebih dari 1.200 jiwa yang beragam dan harmonis.',
  'Terwujudnya lingkungan RW 10 yang aman, nyaman, bersih, harmonis, dan mandiri dengan masyarakat yang aktif berpartisipasi dalam pembangunan berbasis kekeluargaan.',
  ARRAY[
    'Meningkatkan keamanan dan ketertiban lingkungan melalui sistem siskamling dan koordinasi yang efektif.',
    'Mendorong partisipasi aktif seluruh warga dalam kegiatan sosial, gotong royong, dan musyawarah.',
    'Memfasilitasi pelayanan administrasi kependudukan yang cepat, mudah, dan transparan bagi seluruh warga.',
    'Meningkatkan taraf ekonomi warga melalui pemberdayaan UMKM dan kegiatan ekonomi produktif.',
    'Menjaga kebersihan dan kelestarian lingkungan demi kesehatan dan kenyamanan bersama.',
    'Membangun komunikasi yang terbuka dan digital melalui Portal Guyub sebagai sarana informasi warga.'
  ],
  1200, 350, 4, 2, 1,
  'Pos Kamling, Balai Warga, Taman Bermain, Mushola',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15862.5!2d106.989!3d-6.469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjgnOC40IlMgMTA2wrA1OSczMi40IkU!5e0!3m2!1sen!2sid'
)
ON CONFLICT DO NOTHING;

-- Seed: 8 rows lembaga (RT 01-04 + Pokja 10 + PKK + Posyandu + DKM)
INSERT INTO public.lembaga (slug, nama, deskripsi, ketua_nama, program_kerja) VALUES
  ('rt-01', 'Rukun Tetangga 01', 'Pusat informasi dan kegiatan warga wilayah RT 01 RW 10 Desa Cicadas.', 'Ketua RT 01', 'Siskamling, Kerja Bakti Bulanan, Rapat Warga'),
  ('rt-02', 'Rukun Tetangga 02', 'Pusat informasi dan kegiatan warga wilayah RT 02 RW 10 Desa Cicadas.', 'Ketua RT 02', 'Siskamling, Kerja Bakti Bulanan, Rapat Warga'),
  ('rt-03', 'Rukun Tetangga 03', 'Pusat informasi dan kegiatan warga wilayah RT 03 RW 10 Desa Cicadas.', 'Ketua RT 03', 'Siskamling, Kerja Bakti Bulanan, Rapat Warga'),
  ('rt-04', 'Rukun Tetangga 04', 'Pusat informasi dan kegiatan warga wilayah RT 04 RW 10 Desa Cicadas.', 'Ketua RT 04', 'Siskamling, Kerja Bakti Bulanan, Rapat Warga'),
  ('pokja-10', 'Karang Taruna (Pokja 10)', 'Wadah pengembangan generasi muda, tempat berkarya, dan berinovasi untuk kemajuan desa.', 'Ketua Pokja 10', 'Turnamen Olahraga, Pelatihan Keterampilan, Event Kepemudaan'),
  ('pkk', 'Pemberdayaan Kesejahteraan Keluarga (PKK)', 'Gerakan nasional dalam pembangunan masyarakat yang tumbuh dari bawah, oleh, dan untuk masyarakat.', 'Ketua PKK', 'Posyandu, Pembinaan Kesejahteraan Keluarga, Pengelolaan Sampah'),
  ('posyandu', 'Pos Pelayanan Terpadu (Posyandu)', 'Pusat kegiatan kesehatan dasar yang diselenggarakan dari, oleh, dan untuk masyarakat.', 'Ketua Posyandu', 'Imunisasi Balita, Pemeriksaan Ibu Hamil, Pemberian Makanan Tambahan'),
  ('dkm', 'Dewan Kemakmuran Masjid (DKM)', 'Lembaga pengelolaan dan kemakmuran masjid-masjid di lingkungan RW 10.', 'Ketua DKM', 'Pengajian Rutin, Peringatan Hari Besar Islam, Pengelolaan Masjid')
ON CONFLICT (slug) DO NOTHING;

-- Seed: Beberapa ticker awal
INSERT INTO public.ticker (konten, aktif, urutan) VALUES
  ('🚨 Kerja Bakti: Minggu, 20 Juni 2026 pukul 07:00 di lapangan utama. Wajib hadir perwakilan tiap KK.', true, 1),
  ('💰 Iuran Kas: Laporan bulan Mei sudah terbit. Silakan cek di menu Laporan Kas.', true, 2),
  ('🦟 Kesehatan: Jadwal fogging DBD RT 01 s/d RT 04 hari Sabtu sore.', true, 3)
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════
-- SELESAI — Migration 008
-- ══════════════════════════════════════════════════════════════
