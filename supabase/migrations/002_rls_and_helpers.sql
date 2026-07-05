-- ============================================================
-- Guyub Schema Patch v1.1 — RLS & Helper Functions
-- Jalankan di SQL Editor Supabase SETELAH 001_guyub_schema.sql
-- ============================================================

-- ── 1. Pastikan RLS aktif pada semua tabel ────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;

-- ── 2. Helper: Cek apakah user aktif adalah admin ─────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── 3. Profiles — Policies ────────────────────────────────────
-- Drop existing policies (idempotent re-run aman)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles."
  ON public.profiles FOR ALL USING (public.is_admin());

-- ── 4. Surat — Policies ───────────────────────────────────────
DROP POLICY IF EXISTS "Users view own surat." ON public.surat;
DROP POLICY IF EXISTS "Users insert own surat." ON public.surat;
DROP POLICY IF EXISTS "Admin can manage all surat." ON public.surat;

CREATE POLICY "Users view own surat."
  ON public.surat FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own surat."
  ON public.surat FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all surat."
  ON public.surat FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can update all surat."
  ON public.surat FOR UPDATE USING (public.is_admin());

-- ── 5. Pengumuman — Policies ──────────────────────────────────
DROP POLICY IF EXISTS "Pengumuman viewable by everyone." ON public.pengumuman;
DROP POLICY IF EXISTS "Admin can insert pengumuman." ON public.pengumuman;
DROP POLICY IF EXISTS "Admin can update pengumuman." ON public.pengumuman;
DROP POLICY IF EXISTS "Admin can delete pengumuman." ON public.pengumuman;

CREATE POLICY "Pengumuman viewable by everyone."
  ON public.pengumuman FOR SELECT USING (true);

CREATE POLICY "Admin can insert pengumuman."
  ON public.pengumuman FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update pengumuman."
  ON public.pengumuman FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete pengumuman."
  ON public.pengumuman FOR DELETE USING (public.is_admin());

-- ── 6. UMKM — Policies ───────────────────────────────────────
DROP POLICY IF EXISTS "UMKM are viewable by everyone." ON public.umkm;
DROP POLICY IF EXISTS "Users can create UMKM." ON public.umkm;
DROP POLICY IF EXISTS "Users can update own UMKM." ON public.umkm;
DROP POLICY IF EXISTS "Admin can manage all UMKM." ON public.umkm;

CREATE POLICY "UMKM are viewable by everyone."
  ON public.umkm FOR SELECT USING (true);

CREATE POLICY "Users can create UMKM."
  ON public.umkm FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own UMKM."
  ON public.umkm FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admin can manage all UMKM."
  ON public.umkm FOR ALL USING (public.is_admin());

-- ── 7. Promosikan user pertama menjadi admin ──────────────────
-- GANTI 'email@admin.com' dengan email admin yang sudah terdaftar
-- UPDATE public.profiles
--   SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'email@admin.com');

-- ── 8. Trigger updated_at otomatis pada profiles ──────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
