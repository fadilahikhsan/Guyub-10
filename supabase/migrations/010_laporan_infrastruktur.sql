CREATE TABLE IF NOT EXISTS laporan_infrastruktur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_pelapor VARCHAR(255) DEFAULT 'Anonim',
  kategori VARCHAR(100) NOT NULL,
  deskripsi TEXT NOT NULL,
  lokasi TEXT,
  foto_url TEXT,
  status VARCHAR(50) DEFAULT 'dilaporkan',
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE laporan_infrastruktur ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang bisa melihat laporan" ON laporan_infrastruktur
FOR SELECT USING (true);

CREATE POLICY "Semua orang bisa membuat laporan" ON laporan_infrastruktur
FOR INSERT WITH CHECK (true);

CREATE POLICY "Hanya admin yang bisa update laporan" ON laporan_infrastruktur
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Hanya admin yang bisa delete laporan" ON laporan_infrastruktur
FOR DELETE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
