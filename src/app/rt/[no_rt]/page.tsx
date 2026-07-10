import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllWarga } from "@/lib/supabase/fetchAllWarga";
import { ChevronRight, Home, Users, Phone, MapPin, Calendar, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const RtCharts = dynamic(() => import("./RtCharts"), {
  loading: () => <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">Memuat Statistik...</div>,
});

export const revalidate = 60;

export default async function RtDashboardPage({ params }: { params: Promise<{ no_rt: string }> }) {
  const resolvedParams = await params;
  const noRt = resolvedParams.no_rt;

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  // Ambil profil RT
  const { data: profilRt } = await supabase
    .from("profil_rt")
    .select("*")
    .eq("no_rt", noRt)
    .single();

  // Database warga formatnya '001', '002', jadi kita perlu padStart
  const dbRt = noRt.padStart(3, '0');

  // Ambil semua data secara paralel
  const [
    wargaData,
    wargaFullDataRaw,
    { data: kasData },
    { data: kegiatanData },
  ] = await Promise.all([
    fetchAllWarga("rt, jenis_kelamin, tanggal_lahir, no_kk", dbRt),
    fetchAllWarga("id, nama_lengkap, nik, jenis_kelamin, tanggal_lahir, pekerjaan, status_perkawinan, no_kk, status_warga", dbRt),
    supabase.from("kas").select("*").eq("entitas_type", "RT").eq("entitas_id", noRt).order("tanggal", { ascending: false }),
    supabase.from("kegiatan").select("*").eq("penyelenggara_type", "RT").eq("penyelenggara_id", noRt).order("tanggal", { ascending: true }),
  ]);
  
  // Sort the full data client side since fetchAllWarga doesn't sort by nama_lengkap
  const wargaFullData = (wargaFullDataRaw as any[]).sort((a, b) => (a.nama_lengkap || "").localeCompare(b.nama_lengkap || ""));

  // ── Hitung statistik warga ──
  const totalWarga = wargaData?.length || 0;
  const noKkSet = new Set(wargaData?.map(w => w.no_kk).filter(Boolean));
  const totalKK = noKkSet.size;

  let countLaki = 0;
  let countPerempuan = 0;
  const ageCounts: Record<string, number> = { '0-5 (Balita)': 0, '6-12 (Anak)': 0, '13-17 (Remaja)': 0, '18-59 (Dewasa)': 0, '60+ (Lansia)': 0 };

  wargaData?.forEach(w => {
    if (w.jenis_kelamin === 'L') countLaki++;
    else if (w.jenis_kelamin === 'P') countPerempuan++;

    if (w.tanggal_lahir) {
      const birthDate = new Date(w.tanggal_lahir as string);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age <= 5) ageCounts['0-5 (Balita)']++;
      else if (age <= 12) ageCounts['6-12 (Anak)']++;
      else if (age <= 17) ageCounts['13-17 (Remaja)']++;
      else if (age <= 59) ageCounts['18-59 (Dewasa)']++;
      else ageCounts['60+ (Lansia)']++;
    }
  });

  const genderData = [
    { name: 'Laki-laki', value: countLaki },
    { name: 'Perempuan', value: countPerempuan }
  ];
  const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }));

  // ── Hitung kas ──
  let totalMasuk = 0;
  let totalKeluar = 0;
  kasData?.forEach(k => {
    if (k.jenis === 'masuk') totalMasuk += Number(k.jumlah);
    else totalKeluar += Number(k.jumlah);
  });

  const kasSummary = {
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
    kasData: kasData || [],
  };

  // Warna gradient RT
  const rtColors: Record<string, string> = {
    '01': 'from-sky-600 to-blue-800',
    '02': 'from-emerald-600 to-teal-800',
    '03': 'from-violet-600 to-purple-800',
    '04': 'from-amber-500 to-orange-700',
    '05': 'from-rose-600 to-pink-800',
    '06': 'from-indigo-600 to-blue-900',
    '07': 'from-teal-600 to-cyan-800',
    '08': 'from-fuchsia-600 to-pink-800',
  };
  const gradient = rtColors[noRt] || 'from-primary to-secondary';

  // Helper
  const getAge = (dob: string | null) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const maskNik = (nik: string) => nik ? nik.slice(0, 8) + '********' : '-';

  const formatRp = (num: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Hero Banner ───────────────────── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 geo-pattern opacity-20" />
        <div className="absolute top-10 right-10 w-52 h-52 border border-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl py-14 md:py-20 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">RT {noRt}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {profilRt?.ketua_foto_url ? (
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden flex-shrink-0 bg-white">
                <img src={profilRt.ketua_foto_url} alt={profilRt.ketua_nama} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex-shrink-0">
                <Home className="w-12 h-12 text-white" />
              </div>
            )}
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
                Dashboard RT
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2" style={{ fontFamily: "var(--font-bitter)" }}>
                RT {noRt}
              </h1>
              <p className="text-white/90 text-lg font-medium max-w-2xl">
                {profilRt?.sambutan || `Dashboard informasi lengkap warga dan keuangan RT ${noRt} RW 10 Desa Cicadas.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Charts + Kas */}
          <div className="lg:col-span-2">
            <RtCharts
              genderData={genderData}
              ageData={ageData}
              totalWarga={totalWarga}
              totalKK={totalKK}
              kasSummary={kasSummary}
            />
          </div>

          {/* Right Column: Profil & Agenda */}
          <div className="space-y-6">

            {/* Profil RT Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className={`bg-gradient-to-r ${gradient} p-5`}>
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Profil RT {noRt}
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {profilRt ? (
                  <>
                    {profilRt.ketua_foto_url && (
                      <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img src={profilRt.ketua_foto_url} alt={profilRt.ketua_nama} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="font-black text-lg text-slate-800">{profilRt.ketua_nama}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ketua RT {noRt}</p>
                    </div>
                    {profilRt.visi_misi && (
                      <blockquote className="text-sm italic text-slate-600 leading-relaxed border-l-2 border-primary/30 pl-3">
                        &ldquo;{profilRt.visi_misi}&rdquo;
                      </blockquote>
                    )}
                    {profilRt.kontak && (
                      <a href={`https://wa.me/${profilRt.kontak.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-200">
                        <Phone className="w-4 h-4" /> Hubungi via WhatsApp
                      </a>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Profil RT belum diisi oleh admin.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ringkasan Cepat */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-slate-800 p-5">
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Ringkasan RT {noRt}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Total Warga", value: `${totalWarga} jiwa`, icon: Users, color: "bg-sky-50 text-sky-600" },
                  { label: "Kepala Keluarga", value: `${totalKK} KK`, icon: Home, color: "bg-violet-50 text-violet-600" },
                  { label: "Laki-laki", value: `${countLaki} jiwa`, icon: Users, color: "bg-blue-50 text-blue-600" },
                  { label: "Perempuan", value: `${countPerempuan} jiwa`, icon: Users, color: "bg-pink-50 text-pink-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-slate-800">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda RT */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-primary p-5">
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Agenda RT {noRt}
                </h3>
              </div>
              <div className="p-4">
                {!kegiatanData || kegiatanData.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Belum ada agenda kegiatan.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {kegiatanData.slice(0, 5).map((k) => (
                      <div key={k.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:border-primary/30 transition-colors">
                        <div className="text-center bg-primary/5 rounded-lg px-2.5 py-1.5 border border-primary/10 flex-shrink-0 min-w-[50px]">
                          <p className="text-[10px] font-bold uppercase text-primary/70">{new Date(k.tanggal).toLocaleDateString("id-ID", { month: "short" })}</p>
                          <p className="text-lg font-black text-primary leading-none">{new Date(k.tanggal).getDate()}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{k.judul}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {new Date(k.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </div>
                          {k.lokasi && (
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {k.lokasi}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DATABASE SECTION ───────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl pb-16 space-y-10">

        {/* Tabel Daftar Warga */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className={`bg-gradient-to-r ${gradient} p-5 flex items-center justify-between`}>
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                🗂️ Database Warga RT {noRt}
              </h2>
              <p className="text-white/70 text-xs mt-1">{wargaFullData?.length || 0} jiwa terdaftar</p>
            </div>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
              Data Kependudukan
            </span>
          </div>

          {!wargaFullData || wargaFullData.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">Belum ada data warga untuk RT {noRt}.</p>
              <p className="text-sm text-slate-400 mt-1">Silakan input data melalui Admin Panel.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">#</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Nama Lengkap</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">NIK</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">L/P</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Usia</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Pekerjaan</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {wargaFullData.map((w, i) => (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-5 py-3 text-xs text-slate-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 ${w.jenis_kelamin === 'L' ? 'bg-sky-500' : 'bg-rose-400'}`}>
                            {w.nama_lengkap?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">{w.nama_lengkap}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{maskNik(w.nik)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${w.jenis_kelamin === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-600'}`}>
                          {w.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-slate-700">{getAge(w.tanggal_lahir)} thn</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{w.pekerjaan || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${w.status_warga === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {w.status_warga || 'aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabel Riwayat Kas RT */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-slate-800 p-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                💰 Laporan Kas RT {noRt}
              </h2>
              <p className="text-white/60 text-xs mt-1">{kasData?.length || 0} transaksi tercatat</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase font-bold">Saldo</p>
                <p className={`text-sm font-black ${(totalMasuk - totalKeluar) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatRp(totalMasuk - totalKeluar)}
                </p>
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/60">
            <div className="px-5 py-3 text-center">
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Pemasukan</p>
              <p className="font-black text-slate-800 text-sm">{formatRp(totalMasuk)}</p>
            </div>
            <div className="px-5 py-3 text-center">
              <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider">Pengeluaran</p>
              <p className="font-black text-slate-800 text-sm">{formatRp(totalKeluar)}</p>
            </div>
            <div className="px-5 py-3 text-center">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Saldo Bersih</p>
              <p className={`font-black text-sm ${(totalMasuk - totalKeluar) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatRp(totalMasuk - totalKeluar)}
              </p>
            </div>
          </div>

          {!kasData || kasData.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="font-bold">Belum ada transaksi kas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Tanggal</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Jenis</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Kategori</th>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Keterangan</th>
                    <th className="text-right text-xs font-black uppercase tracking-wider text-slate-500 px-5 py-3">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {kasData.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">
                        {new Date(k.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${k.jenis === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {k.jenis === 'masuk' ? '▲ Masuk' : '▼ Keluar'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-600 font-bold">{k.kategori || '-'}</td>
                      <td className="px-5 py-3 text-sm text-slate-700 max-w-[200px] truncate">{k.keterangan}</td>
                      <td className={`px-5 py-3 text-right text-sm font-black font-mono ${k.jenis === 'masuk' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {k.jenis === 'masuk' ? '+' : '-'}{formatRp(Number(k.jumlah))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
