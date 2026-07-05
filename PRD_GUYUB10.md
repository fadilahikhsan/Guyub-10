# 📋 PRD — Portal Digital "Guyub 10"
> **Dokumen ini adalah panduan lengkap untuk AI developer / developer.**
> Baca seluruh dokumen sebelum menulis satu baris kode pun.
> Tujuan: rombak dan kembangkan web RW dari kondisi 70% → 100% production-ready.

---

## 🧭 KONTEKS PROYEK

**Nama Portal:** Guyub 10
**Deskripsi:** Portal digital resmi RW 10, Desa Cicadas, Kecamatan Gunung Putri, Kabupaten Bogor.
**Tujuan:** Satu platform untuk semua kebutuhan warga — informasi, layanan surat, direktori UMKM, transparansi keuangan, dan database warga.
**Target pengguna:** Semua kalangan — orang tua hingga anak muda. UI harus mudah dipahami oleh siapa saja.
**Tech Stack:**
- Framework: Next.js (App Router)
- UI: React + Tailwind CSS v4 + Shadcn UI
- Backend/DB: Supabase (Auth + Database + Storage)
- Bahasa: TypeScript
- Font: Roboto, Bitter, Plus Jakarta Sans (sudah terpasang)

---

## ⚠️ WAJIB DIBACA SEBELUM MENGERJAKAN

### LANGKAH 1 — AUDIT DULU, BARU KERJAKAN

Sebelum membuat atau mengubah file apapun, lakukan audit ini:

```
CHECKLIST AUDIT:
[ ] Baca semua file di /app untuk pahami struktur yang ada
[ ] Baca semua file di /migrations untuk pahami schema DB
[ ] Identifikasi: mana yang hardcode vs dynamic dari DB
[ ] Identifikasi: mana yang sudah ada tapi perlu dimodifikasi
[ ] Identifikasi: mana yang harus dibuat dari nol
[ ] Baru mulai kerjakan sesuai urutan ROADMAP di bawah
```

### LANGKAH 2 — PRINSIP PENGERJAAN

1. **Jangan hapus yang sudah berfungsi** — modifikasi, bukan ganti total
2. **Mobile-first** — semua halaman harus responsive sempurna
3. **Tidak ada data hardcode di UI** — semua konten harus dari database/Supabase, bisa diupdate admin
4. **Admin = pusat kontrol semua konten** — setiap teks, foto, data di situs harus bisa diupdate dari dashboard admin
5. **Desain: Modern & Vibrant** — gradasi warna, bold color, card modern. Bukan jadul/flat. Lihat detail di seksi Desain
6. **Satu admin, satu akun** — sistem single admin, tidak ada role warga login (fitur warga portal dihapus/disederhanakan)

---

## 📊 STATUS KONDISI SAAT INI (Audit Hasil)

### ✅ SUDAH ADA & BERFUNGSI (pertahankan, modifikasi seperlunya)
| File | Status | Catatan |
|------|--------|---------|
| `app/page.tsx` | ✅ Berfungsi | Ada running ticker, berita, sambutan RW, statistik. Perlu redesign & tambah fitur |
| `app/layout.tsx` | ✅ Berfungsi | Font sudah setup, Navbar & Footer sudah ada |
| `app/admin/page.tsx` | ✅ Berfungsi | Dashboard admin sudah ada: surat, UMKM, kegiatan, pengumuman |
| `app/admin/SuratTable.tsx` | ✅ Berfungsi | Manajemen surat sudah ada |
| `app/admin/PengumumanManager.tsx` | ✅ Berfungsi | CRUD pengumuman sudah ada |
| `app/admin/KegiatanManager.tsx` | ✅ Berfungsi | CRUD kegiatan sudah ada |
| `app/admin/UmkmManager.tsx` | ✅ Berfungsi | Approval UMKM sudah ada |
| `app/layanan/page.tsx` | ✅ Berfungsi | Form multi-step sudah ada, perlu tambah jenis surat & PDF output |
| `app/umkm/page.tsx` | ✅ Berfungsi | Tampil list UMKM dari DB, perlu tambah tombol WA & foto |
| `app/profil/page.tsx` | ⚠️ Parsial | Ada tapi **SEMUA DATA HARDCODE** — harus dibuat dynamic dari DB |
| `app/kegiatan/page.tsx` | ⚠️ Parsial | Ada tapi belum ada kalender visual |
| `app/informasi/page.tsx` | ⚠️ Parsial | Ada tapi perlu redesign |
| `migrations/001-007` | ✅ Di-deploy | Schema `profiles`, `umkm`, `surat`, `pengumuman`, `kegiatan` sudah ada |

### ❌ BELUM ADA (harus dibuat dari nol)
- Jadwal sholat (widget, API gratis)
- Widget cuaca (API gratis)
- Halaman Fasilitas & Sarana
- Halaman struktur RT 1-4 masing-masing (dinamis)
- Galeri foto dinamis (upload dari admin)
- Laporan Kas / Transparansi Keuangan
- Database Warga (tabel baru + halaman + password protection)
- Papan Aspirasi / Kotak Saran
- Surat → generate PDF langsung (download)
- Running ticker yang isinya dari DB (saat ini hardcode)
- Foto/konten Profil RW yang bisa diupdate admin
- Sambutan Ketua RW yang bisa diupdate admin (nama, foto, teks)

---

## 🗺️ STRUKTUR HALAMAN (Sitemap Final)

```
/ (Beranda)
├── /profil          → Profil RW 10 (visi misi, sambutan, fasilitas, kondisi wilayah)
├── /informasi       → Berita & Pengumuman
├── /kegiatan        → Agenda Kegiatan + Kalender
├── /lembaga         → Lembaga-lembaga RW
│   ├── /lembaga/rt-01
│   ├── /lembaga/rt-02
│   ├── /lembaga/rt-03
│   ├── /lembaga/rt-04
│   ├── /lembaga/pokja-10
│   ├── /lembaga/pkk
│   ├── /lembaga/posyandu
│   └── /lembaga/dkm
├── /fasilitas       → Fasilitas & Sarana (BARU)
├── /layanan         → Layanan Surat (diperbarui)
├── /umkm            → Direktori UMKM
├── /galeri          → Galeri Foto (dinamis)
├── /kas             → Laporan Kas & Keuangan (BARU)
├── /aspirasi        → Papan Aspirasi (BARU)
├── /warga           → Database Warga (password protected, BARU)
├── /login           → Login Admin
└── /admin           → Dashboard Admin (diperluas)
```

**Navbar:** Beranda | Profil | Informasi | Kegiatan | Layanan | UMKM | Lembaga ▾ | [Tombol Masuk Admin]

---

## 🎨 PANDUAN DESAIN

### Palet Warna (Modern & Vibrant)
```css
/* Primary gradient */
--gradient-primary: linear-gradient(135deg, #1a56db, #7c3aed);

/* Accent */
--accent-amber: #f59e0b;
--accent-emerald: #10b981;

/* Background */
--bg-base: #f8fafc;
--bg-card: #ffffff;

/* Dark sections */
--bg-dark: #0f172a;
```

### Prinsip Desain
- **Hero sections**: Gradasi warna gelap (biru/ungu) dengan overlay, bukan flat putih
- **Cards**: Rounded-2xl atau rounded-3xl, shadow halus, hover effect subtle
- **Typography**: Font Bitter untuk heading (bold, impactful), Jakarta Sans untuk body
- **Warna badge**: Amber untuk penting, emerald untuk sukses, biru untuk info
- **Animasi**: fade-in-up saat scroll, hover transitions smooth (150-200ms)
- **Ikon**: Lucide React (sudah terpasang)
- **Gambar placeholder**: Gradient berwarna, BUKAN gambar kosong atau broken

### Responsif
- Mobile: 1 kolom
- Tablet: 2 kolom
- Desktop: Layout utama + sidebar (seperti yang sudah ada di beranda)

---

## 📄 DETAIL FITUR PER HALAMAN

---

### 1. BERANDA (`/`)

**Urutan konten dari atas ke bawah:**

1. **Running Ticker** — isi dari tabel `ticker` di DB (admin update), tampil marquee
2. **Navbar**
3. **Hero Section** — foto/video lingkungan + headline "Selamat Datang di Guyub 10" + deskripsi singkat + CTA button
4. **Widget Bar** — jadwal sholat (hari ini, 5 waktu) + cuaca Gunung Putri (API gratis)
5. **Berita Terkini** — dari tabel `pengumuman`, 4-5 artikel terbaru
6. **Info Layanan Singkat** — grid 4 kotak: Surat, UMKM, Galeri, Fasilitas (link ke halaman masing-masing)
7. **Sambutan Ketua RW** — foto + nama + kutipan singkat (semua dari DB, admin bisa update)
8. **Infografis Wilayah** — jumlah warga, KK, RT, masjid, fasilitas (dari DB)
9. **Agenda Terdekat** — 3 kegiatan paling dekat tanggalnya dari tabel `kegiatan`
10. **Direktori UMKM Preview** — 4-6 UMKM unggulan + tombol "Lihat Semua"
11. **Footer**

---

### 2. PROFIL RW (`/profil`)

**Semua data dari DB, admin bisa update.**

Konten:
- **Sejarah singkat RW 10**
- **Visi & Misi**
- **Sambutan Ketua RW** (foto, nama, jabatan, teks sambutan)
- **Struktur Pengurus Harian** (Ketua, Sekretaris, Bendahara + kontak WA)
- **Struktur RT 1-4** (klik → ke halaman `/lembaga/rt-01` dst)
- **Lembaga-lembaga** (Pokja 10, PKK, Posyandu, DKM)
- **Kondisi Wilayah** — infografis: jumlah masjid, lapangan, fasilitas umum, dll
- **Peta Wilayah** — embed Google Maps RW 10 Desa Cicadas Gunung Putri

**Tabel DB baru yang dibutuhkan:**
```sql
-- Tabel profil_rw (untuk data yang bisa diedit admin)
CREATE TABLE profil_rw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketua_nama VARCHAR(255),
  ketua_foto_url TEXT,
  ketua_sambutan TEXT,
  ketua_wa VARCHAR(20),
  sekretaris_nama VARCHAR(255),
  sekretaris_wa VARCHAR(20),
  bendahara_nama VARCHAR(255),
  bendahara_wa VARCHAR(20),
  sejarah TEXT,
  visi TEXT,
  misi TEXT[], -- array
  jumlah_warga INT,
  jumlah_kk INT,
  jumlah_masjid INT,
  jumlah_lapangan INT,
  fasilitas_lain TEXT,
  maps_embed_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3. LEMBAGA & RT (`/lembaga/[slug]`)

**Halaman dinamis berdasarkan slug.**

Slug yang valid: `rt-01`, `rt-02`, `rt-03`, `rt-04`, `pokja-10`, `pkk`, `posyandu`, `dkm`

Konten per halaman:
- Nama & deskripsi lembaga
- Foto pengurus (opsional)
- Struktur kepengurusan (ketua, sekretaris, bendahara)
- Program kerja / kegiatan rutin
- Kontak

**Tabel DB baru:**
```sql
CREATE TABLE lembaga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- 'rt-01', 'pkk', dll
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  ketua_nama VARCHAR(255),
  ketua_foto_url TEXT,
  ketua_wa VARCHAR(20),
  program_kerja TEXT,
  kontak_wa VARCHAR(20),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. FASILITAS & SARANA (`/fasilitas`) — BARU

Konten:
- List fasilitas (nama, deskripsi, foto, jam operasional, cara peminjaman)
- Setiap fasilitas ada tombol "Ajukan Peminjaman" → redirect ke `/layanan` dengan jenis surat pre-filled "Surat Izin Peminjaman Fasilitas"

**Tabel DB baru:**
```sql
CREATE TABLE fasilitas (
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
```

---

### 5. LAYANAN SURAT (`/layanan`) — DIPERBARUI

**Alur baru:**
1. Warga pilih jenis surat
2. Isi form (NIK, nama, alamat, keperluan, upload KTP/KK)
3. Submit → notifikasi WA ke admin RT/RW yang relevan
4. Admin approve di dashboard → **surat PDF ter-generate otomatis**
5. Warga bisa download PDF dari halaman status (cek via nomor tiket atau NIK)

**Jenis surat yang tersedia:**
1. Surat Keterangan Domisili
2. Surat Pengantar SKCK
3. Surat Keterangan Tidak Mampu (SKTM)
4. Surat Keterangan Usaha (SKU)
5. Surat Pengantar Nikah
6. Surat Keterangan Kematian
7. Surat Keterangan Pindah Domisili
8. Surat Pengantar Pendataan Penduduk Baru
9. Surat Izin Keramaian / Acara
10. Surat Peminjaman Fasilitas

**Tujuan surat:**
- Pilihan: ke RW / ke RT 1 / ke RT 2 / ke RT 3 / ke RT 4
- Masing-masing punya nomor WA yang bisa diupdate admin

**Generate PDF:**
- Gunakan library `pdf-lib` atau `puppeteer` (server-side)
- Template surat dengan kop resmi RW 10, nomor surat otomatis, QR code verifikasi
- Admin upload template surat per jenis di dashboard

**Update tabel `surat`:**
```sql
ALTER TABLE surat ADD COLUMN tujuan VARCHAR(50); -- 'rw', 'rt-01', dll
ALTER TABLE surat ADD COLUMN nomor_tiket VARCHAR(20) UNIQUE;
ALTER TABLE surat ADD COLUMN pdf_url TEXT; -- URL PDF yang sudah jadi
ALTER TABLE surat ADD COLUMN notif_wa_sent BOOLEAN DEFAULT false;
```

---

### 6. DIREKTORI UMKM (`/umkm`) — DIPERBARUI

Tambahan dari kondisi saat ini:
- Setiap kartu UMKM ada **tombol WhatsApp langsung** (link `https://wa.me/62xxx`)
- Field foto usaha (upload dari admin atau pemilik)
- Filter by kategori sudah ada, pertahankan
- Search sudah ada (client-side), pertahankan

**Update tabel `umkm`:**
```sql
ALTER TABLE umkm ADD COLUMN foto_url TEXT;
ALTER TABLE umkm ADD COLUMN alamat TEXT;
ALTER TABLE umkm ADD COLUMN jam_buka TEXT;
```

---

### 7. GALERI FOTO (`/galeri`) — DIBUAT ULANG

Saat ini halaman galeri statis. Harus dinamis.

Konten:
- Grid foto masonry atau kolom
- Setiap foto punya keterangan & tanggal
- Filter by album/kategori
- Admin upload foto langsung dari dashboard (ke Supabase Storage, bukan URL eksternal)

**Tabel DB baru:**
```sql
CREATE TABLE galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT NOT NULL, -- dari Supabase Storage
  album VARCHAR(100), -- 'kegiatan', 'lingkungan', 'fasilitas', dll
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 8. LAPORAN KAS (`/kas`) — BARU

Konten publik:
- Ringkasan saldo per bulan
- Tabel pemasukan & pengeluaran
- Grafik sederhana (opsional)
- Filter by bulan/tahun

Admin bisa tambah entri dari dashboard.

**Tabel DB baru:**
```sql
CREATE TABLE kas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  keterangan TEXT NOT NULL,
  jenis VARCHAR(10) NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  jumlah BIGINT NOT NULL, -- dalam rupiah
  kategori VARCHAR(100), -- 'iuran warga', 'kegiatan', 'operasional', dll
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 9. PAPAN ASPIRASI (`/aspirasi`) — BARU

Fitur:
- Form kirim aspirasi/saran (nama opsional, bisa anonim, kategori, isi pesan)
- List aspirasi publik (nama, tanggal, status: "Diproses" / "Ditindaklanjuti")
- Admin bisa update status & beri balasan dari dashboard

**Tabel DB baru:**
```sql
CREATE TABLE aspirasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) DEFAULT 'Anonim',
  kategori VARCHAR(100),
  pesan TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'masuk', -- 'masuk', 'diproses', 'selesai'
  balasan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 10. DATABASE WARGA (`/warga`) — BARU

**Akses berlapis:**

**Level 1 — Publik (tanpa password):**
- Summary infografis: total warga, total KK, persentase gender, distribusi usia
- Tidak ada data pribadi sama sekali

**Level 2 — Warga umum (dengan password khusus):**
- Bisa lihat nama warga per RT (nama saja, tanpa NIK/KK/alamat)
- Password disimpan sebagai env variable / setting admin

**Level 3 — Admin (login Supabase):**
- Data lengkap: NIK, KK, nama, alamat, tanggal lahir, jenis kelamin, status
- Filter per RT
- Export ke CSV yang terformat rapi
- Import dari Excel (.xlsx)

**Tabel DB baru:**
```sql
CREATE TABLE warga (
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
  rt VARCHAR(3) NOT NULL, -- '01', '02', '03', '04'
  alamat TEXT,
  status_warga VARCHAR(50) DEFAULT 'aktif', -- 'aktif', 'pindah', 'meninggal'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Import Excel:**
- Di dashboard admin ada tombol "Import Data Excel"
- Gunakan library `xlsx` (SheetJS) untuk parse file
- Validasi kolom sebelum insert
- Tampilkan preview 10 baris sebelum konfirmasi import

---

### 11. TICKER / RUNNING TEXT — DIBUAT DINAMIS

Saat ini hardcode. Harus dari DB.

**Tabel DB baru:**
```sql
CREATE TABLE ticker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  konten TEXT NOT NULL,
  aktif BOOLEAN DEFAULT true,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Admin bisa tambah/hapus/nonaktifkan ticker dari dashboard.

---

## 🛠️ DASHBOARD ADMIN — DIPERLUAS

Dashboard admin harus mencakup semua fitur baru. Tambahkan tab/menu baru:

| Menu Admin | Fungsi |
|-----------|--------|
| Overview | Statistik utama (sudah ada) |
| Profil RW | Edit semua konten profil RW (nama pengurus, foto, visi misi, dll) |
| Ticker | Kelola running text |
| Berita/Pengumuman | CRUD berita (sudah ada, pertahankan) |
| Kegiatan | CRUD agenda kegiatan (sudah ada, pertahankan) |
| Lembaga & RT | Edit data setiap RT dan lembaga |
| Fasilitas | CRUD fasilitas & sarana |
| Layanan Surat | Proses surat, generate PDF, kirim notif WA (sudah ada sebagian) |
| UMKM | Approve/tolak UMKM (sudah ada), tambah foto |
| Galeri | Upload foto ke Supabase Storage |
| Laporan Kas | CRUD entri kas masuk/keluar |
| Aspirasi | Lihat & balas aspirasi warga |
| Database Warga | Import Excel, lihat data, export CSV |
| Pengaturan | Update password warga (level 2), nomor WA admin RT/RW |

---

## 🔌 API & LAYANAN EKSTERNAL (GRATIS)

### Jadwal Sholat
- **API:** `https://api.aladhan.com/v1/timingsByCity`
- **Parameter:** `city=Gunung Putri&country=Indonesia&method=11`
- **Fetch setiap hari**, cache 24 jam di sisi client
- Tampilkan: Subuh, Dzuhur, Ashar, Maghrib, Isya

### Cuaca
- **API:** OpenWeatherMap (free tier, 1000 call/hari)
- **Koordinat Gunung Putri:** lat=-6.469, lon=106.989
- Tampilkan: suhu, kondisi cuaca, ikon

### Peta Wilayah
- **Embed Google Maps** (gratis untuk embed statis)
- URL embed disesuaikan dengan lokasi RW 10 Desa Cicadas

---

## 📅 ROADMAP PENGERJAAN

Kerjakan dalam urutan ini agar tidak ada dependensi yang rusak:

### FASE 1 — Database (lakukan semua migrasi dulu)
```
[ ] Buat migration: profil_rw
[ ] Buat migration: lembaga
[ ] Buat migration: fasilitas
[ ] Buat migration: galeri
[ ] Buat migration: kas
[ ] Buat migration: aspirasi
[ ] Buat migration: warga
[ ] Buat migration: ticker
[ ] Update tabel: surat (tambah kolom baru)
[ ] Update tabel: umkm (tambah kolom baru)
[ ] Isi data awal: profil_rw, lembaga (seed data)
```

### FASE 2 — Dashboard Admin (backend dulu, baru UI)
```
[ ] Tambah menu: Profil RW editor
[ ] Tambah menu: Ticker manager
[ ] Tambah menu: Lembaga editor
[ ] Tambah menu: Fasilitas manager
[ ] Tambah menu: Galeri upload (Supabase Storage)
[ ] Tambah menu: Laporan Kas CRUD
[ ] Tambah menu: Aspirasi manager
[ ] Tambah menu: Database Warga (import Excel + view + export)
[ ] Update menu: Surat (tambah generate PDF)
[ ] Tambah menu: Pengaturan (password warga, nomor WA)
```

### FASE 3 — Halaman Publik
```
[ ] Update Beranda: tambah widget sholat, cuaca, restrukturisasi layout
[ ] Update Profil RW: semua dari DB
[ ] Update Lembaga: halaman dinamis semua lembaga + RT
[ ] Buat halaman: /fasilitas
[ ] Update Layanan Surat: tambah semua jenis surat, generate PDF
[ ] Update UMKM: tambah tombol WA, foto
[ ] Update Galeri: buat dinamis dari DB
[ ] Buat halaman: /kas
[ ] Buat halaman: /aspirasi
[ ] Buat halaman: /warga (3 level akses)
[ ] Update Kegiatan: tambah kalender visual
[ ] Update Ticker: dari DB
```

### FASE 4 — Polish & QA
```
[ ] Pastikan semua halaman responsive (mobile, tablet, desktop)
[ ] Uji semua form (submit, validasi, error handling)
[ ] Uji upload file (foto, dokumen)
[ ] Uji generate PDF surat
[ ] Uji import Excel database warga
[ ] Uji API jadwal sholat & cuaca (handle jika API down)
[ ] Cek semua data hardcode — pastikan sudah dari DB
[ ] Uji dashboard admin semua menu
```

---

## 🚨 PANTANGAN / JANGAN DILAKUKAN

1. ❌ Jangan hardcode nama pengurus, teks sambutan, atau angka statistik di UI
2. ❌ Jangan buat halaman baru tanpa cek dulu apakah sudah ada
3. ❌ Jangan gunakan `<form>` HTML biasa — gunakan React event handlers atau Server Actions
4. ❌ Jangan simpan gambar sebagai URL eksternal — selalu upload ke Supabase Storage
5. ❌ Jangan buat fitur login warga — sistem ini single admin only
6. ❌ Jangan skip error handling di fetch API eksternal (sholat, cuaca bisa down)
7. ❌ Jangan lupa RLS (Row Level Security) di setiap tabel Supabase baru

---

## 📁 REFERENSI FILE PENTING

```
/app/page.tsx              → Beranda (ada running ticker, berita, sambutan, stats)
/app/admin/page.tsx        → Dashboard admin utama
/app/admin/actions.ts      → Server actions admin
/app/layanan/page.tsx      → Form surat multi-step
/app/layanan/actions.ts    → Submit surat server action
/app/umkm/page.tsx         → Direktori UMKM
/app/profil/page.tsx       → Profil RW (SEMUA HARDCODE — harus dibuat dynamic)
/app/kegiatan/page.tsx     → Agenda kegiatan
/app/galeri/page.tsx       → Galeri (statis — harus dibuat dynamic)
/migrations/001-007        → Schema DB yang sudah ada
```

---

## ✅ DEFINISI "SELESAI"

Proyek dianggap selesai (production-ready) jika:
- [ ] Semua halaman bisa diakses tanpa error
- [ ] Semua konten bisa diupdate dari dashboard admin tanpa sentuh kode
- [ ] Surat bisa diajukan dan di-download sebagai PDF
- [ ] Database warga bisa diimport dari Excel
- [ ] Jadwal sholat dan cuaca tampil real-time
- [ ] Semua halaman responsive di mobile
- [ ] Tidak ada data hardcode di UI publik

---

*Dokumen ini dibuat berdasarkan audit kode aktual proyek Guyub 10 per 27 Juni 2026.*
*Owner: Fadilah Ikhsan — RW 10 Desa Cicadas, Gunung Putri, Bogor.*
