import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { 
  FileText, Users, Store, Megaphone, Calendar, 
  Settings, Image, DollarSign, MessageSquare, 
  Database, Type, Building, Landmark, Wrench
} from "lucide-react";
import { SuratTable } from "./SuratTable";
import { PengumumanManager } from "./PengumumanManager";
import KegiatanManager from "./KegiatanManager";
import { UmkmManager } from "./UmkmManager";
import { ProfilRwEditor } from "./ProfilRwEditor";
import { TickerManager } from "./TickerManager";
import { LembagaEditor } from "./LembagaEditor";
import { FasilitasManager } from "./FasilitasManager";
import { GaleriManager } from "./GaleriManager";
import { KasManager } from "./KasManager";
import { AspirasiManager } from "./AspirasiManager";
import { WargaManager } from "./WargaManager";
import { LaporanManager } from "./LaporanManager";
import { KomentarManager } from "./KomentarManager";
import AdminTabs from "./AdminTabs";

export const revalidate = 0;

const MENU_ITEMS = [
  { key: "overview", label: "Overview", icon: "BarChart3" },
  { key: "profil", label: "Profil RW", icon: "Landmark" },
  { key: "ticker", label: "Ticker", icon: "Type" },
  { key: "pengumuman", label: "Berita Warga", icon: "Megaphone" },
  { key: "kegiatan", label: "Kegiatan", icon: "Calendar" },
  { key: "lembaga", label: "Lembaga & RT", icon: "Building" },
  { key: "fasilitas", label: "Fasilitas", icon: "Building" },
  { key: "surat", label: "Layanan Surat", icon: "FileText" },
  { key: "umkm", label: "UMKM", icon: "Store" },
  { key: "galeri", label: "Galeri", icon: "Image" },
  { key: "kas", label: "Laporan Kas", icon: "DollarSign" },
  { key: "laporan", label: "Infrastruktur", icon: "Wrench" },
  { key: "aspirasi", label: "Aspirasi", icon: "MessageSquare" },
  { key: "warga", label: "Database Warga", icon: "Database" },
  { key: "komentar", label: "Komentar Berita", icon: "MessageSquare" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = createAdminClient();

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams?.tab || "overview";

  // Ambil semua data yang dibutuhkan
  const [
    { count: countProfiles },
    { count: countSurat },
    { count: countUmkm },
    { count: countPengumuman },
    { count: countKegiatan },
    { count: countAspirasi },
    { count: countWarga },
    { count: countLaporan },
    { data: suratList },
    { data: pengumumanList },
    { data: kegiatanList },
    { data: umkmListAdmin },
    { data: profilRw },
    { data: tickerList },
    { data: lembagaList },
    { data: fasilitasList },
    { data: galeriList },
    { data: kasList },
    { data: aspirasiList },
    { data: wargaList },
    { data: laporanList },
    { data: komentarListAdmin },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("surat").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("umkm").select("*", { count: "exact", head: true }),
    supabase.from("pengumuman").select("*", { count: "exact", head: true }),
    supabase.from("kegiatan").select("*", { count: "exact", head: true }),
    supabase.from("aspirasi").select("*", { count: "exact", head: true }).eq("status", "masuk"),
    supabase.from("warga").select("*", { count: "exact", head: true }),
    supabase.from("laporan_infrastruktur").select("*", { count: "exact", head: true }).eq("status", "masuk"),
    supabase.from("surat").select(`id, jenis_surat, keperluan, status, catatan_admin, lampiran_url, tujuan, nomor_tiket, pdf_url, created_at, profiles ( nama_lengkap, rt )`).order("created_at", { ascending: false }).limit(50),
    supabase.from("pengumuman").select("id, judul, konten, kategori, foto_url, created_at").order("created_at", { ascending: false }),
    supabase.from("kegiatan").select("*").order("tanggal", { ascending: true }),
    supabase.from("umkm").select(`id, nama_usaha, kategori, deskripsi, nomor_wa, is_approved, foto_url, alamat, jam_buka, created_at, profiles ( nama_lengkap, rt )`).order("created_at", { ascending: false }),
    supabase.from("profil_rw").select("*").limit(1).single(),
    supabase.from("ticker").select("*").order("urutan", { ascending: true }),
    supabase.from("lembaga").select("*").order("slug", { ascending: true }),
    supabase.from("fasilitas").select("*").order("created_at", { ascending: false }),
    supabase.from("galeri").select("*").order("created_at", { ascending: false }),
    supabase.from("kas").select("*").order("tanggal", { ascending: false }).limit(100),
    supabase.from("aspirasi").select("*").order("created_at", { ascending: false }),
    supabase.from("warga").select("*").order("nama_lengkap", { ascending: true }),
    supabase.from("laporan_infrastruktur").select("*").order("created_at", { ascending: false }),
    supabase.from("komentar_pengumuman").select('id, nama, email, isi, status, created_at, pengumuman_id, pengumuman(judul)').order("created_at", { ascending: false }),
  ]);

  const stats = [
    { icon: Users, label: "Total Warga", value: countWarga ?? 0, unit: "jiwa", color: "blue" },
    { icon: FileText, label: "Surat Pending", value: countSurat ?? 0, unit: "menunggu", color: "amber" },
    { icon: Store, label: "UMKM", value: countUmkm ?? 0, unit: "usaha", color: "emerald" },
    { icon: Megaphone, label: "Berita Warga", value: countPengumuman ?? 0, unit: "postingan", color: "purple" },
    { icon: MessageSquare, label: "Aspirasi Baru", value: countAspirasi ?? 0, unit: "pesan", color: "rose" },
    { icon: Wrench, label: "Laporan Masuk", value: countLaporan ?? 0, unit: "laporan", color: "indigo" },
  ];

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100 text-blue-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100 text-amber-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100 text-emerald-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100 text-purple-600" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-100 text-rose-600" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "bg-indigo-100 text-indigo-600" },
  };

  return (
    <div className="space-y-8 text-zinc-900">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-1">Dashboard Pengurus RW</h2>
        <p className="text-zinc-500 font-medium">Berikut adalah ringkasan data dan aktivitas terbaru Portal Guyub RW 10.</p>
      </div>

      {/* Tab Navigation */}
      <AdminTabs menuItems={MENU_ITEMS} activeTab={activeTab} />

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((stat) => {
              const c = colorMap[stat.color];
              return (
                <div key={stat.label} className={`${c.bg} p-6 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${c.icon} p-3 rounded-xl`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-700">{stat.label}</h3>
                  </div>
                  <p className={`text-4xl font-black ${c.text}`}>
                    {stat.value}
                    <span className="text-sm text-zinc-400 font-medium ml-2">{stat.unit}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROFIL RW TAB ── */}
      {activeTab === "profil" && (
        <ProfilRwEditor data={profilRw} />
      )}

      {/* ── TICKER TAB ── */}
      {activeTab === "ticker" && (
        <TickerManager tickerList={tickerList ?? []} />
      )}

      {/* ── SURAT TAB ── */}
      {activeTab === "surat" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-black text-zinc-800">Manajemen Pengajuan Surat</h3>
          </div>
          <SuratTable suratList={suratList ?? []} ketuaNama={profilRw?.ketua_nama ?? "Ketua RW"} />
        </div>
      )}

      {/* ── UMKM TAB ── */}
      {activeTab === "umkm" && (
        <UmkmManager umkmList={umkmListAdmin ?? []} />
      )}

      {/* ── KEGIATAN TAB ── */}
      {activeTab === "kegiatan" && (
        <KegiatanManager data={kegiatanList ?? []} />
      )}

      {/* ── PENGUMUMAN TAB ── */}
      {activeTab === "pengumuman" && (
        <PengumumanManager pengumumanList={pengumumanList ?? []} />
      )}

      {/* ── LEMBAGA TAB ── */}
      {activeTab === "lembaga" && (
        <LembagaEditor lembagaList={lembagaList ?? []} />
      )}

      {/* ── FASILITAS TAB ── */}
      {activeTab === "fasilitas" && (
        <FasilitasManager fasilitasList={fasilitasList ?? []} />
      )}

      {/* ── GALERI TAB ── */}
      {activeTab === "galeri" && (
        <GaleriManager galeriList={galeriList ?? []} />
      )}

      {/* ── KAS TAB ── */}
      {activeTab === "kas" && (
        <KasManager kasList={kasList ?? []} />
      )}

      {/* ── LAPORAN TAB ── */}
      {activeTab === "laporan" && (
        <LaporanManager laporanList={laporanList ?? []} />
      )}

      {/* ── ASPIRASI TAB ── */}
      {activeTab === "aspirasi" && (
        <AspirasiManager aspirasiList={aspirasiList ?? []} />
      )}

      {/* ── WARGA TAB ── */}
      {activeTab === "warga" && (
        <WargaManager wargaList={wargaList ?? []} />
      )}

      {/* ── KOMENTAR TAB ── */}
      {activeTab === "komentar" && (
        <KomentarManager komentarList={komentarListAdmin ?? []} />
      )}
    </div>
  );
}
