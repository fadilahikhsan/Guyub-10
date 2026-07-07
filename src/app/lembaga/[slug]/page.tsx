import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Calendar, Users, MapPin, Clock, Megaphone, Building, Heart, Shield, Wallet, TrendingUp, TrendingDown } from "lucide-react";

export const revalidate = 0;

export default async function LembagaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // Ambil data lembaga berdasarkan slug
  const { data: lembaga } = await supabase
    .from("lembaga")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!lembaga) {
    notFound();
  }

  // Tentukan icon dan warna berdasarkan slug
  let Icon = Users;
  let color = "from-blue-600 to-blue-800";
  let badgeColor = "bg-blue-100 text-blue-700";

  if (slug.includes('rt')) {
    Icon = Building;
  } else if (slug.includes('pkk')) {
    Icon = Heart;
    color = "from-pink-500 to-rose-700";
    badgeColor = "bg-pink-100 text-pink-700";
  } else if (slug.includes('posyandu')) {
    Icon = Shield;
    color = "from-emerald-500 to-teal-700";
    badgeColor = "bg-emerald-100 text-emerald-700";
  } else if (slug.includes('pokja') || slug.includes('karang-taruna')) {
    color = "from-indigo-600 to-purple-800";
    badgeColor = "bg-indigo-100 text-indigo-700";
  }

  // Ambil kegiatan khusus lembaga ini (menggunakan penyelenggara_type baru)
  const { data: kegiatan } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("penyelenggara_type", "Lembaga")
    .eq("penyelenggara_id", slug)
    .order("tanggal", { ascending: true });

  // Ambil pengumuman khusus lembaga
  const { data: pengumuman } = await supabase
    .from("pengumuman")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Ambil kas lembaga
  const { data: kasLembaga } = await supabase
    .from("kas")
    .select("*")
    .eq("entitas_type", "Lembaga")
    .eq("entitas_id", slug)
    .order("tanggal", { ascending: false });

  let totalMasuk = 0;
  let totalKeluar = 0;
  kasLembaga?.forEach(k => {
    if (k.jenis === 'masuk') totalMasuk += Number(k.jumlah);
    else totalKeluar += Number(k.jumlah);
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner Khusus Lembaga */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${color} geo-pattern`}>
        <div className="absolute top-8 right-8 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/profil" className="hover:text-white transition-colors">Profil</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">{lembaga.nama}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {lembaga.ketua_foto_url ? (
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0 bg-white">
                <img src={lembaga.ketua_foto_url} alt={lembaga.ketua_nama} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex-shrink-0">
                <Icon className="w-12 h-12 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2" style={{ fontFamily: "var(--font-bitter)" }}>
                {lembaga.nama}
              </h1>
              <p className="text-white/90 text-lg font-medium max-w-2xl">
                {lembaga.deskripsi}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Info Lembaga & Kegiatan */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 ${badgeColor}`}>Kepengurusan</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {lembaga.ketua_nama && (
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Ketua</p>
                        <p className="font-bold text-zinc-800">{lembaga.ketua_nama}</p>
                      </div>
                    )}
                    {lembaga.sekretaris_nama && (
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Sekretaris</p>
                        <p className="font-bold text-zinc-800">{lembaga.sekretaris_nama}</p>
                      </div>
                    )}
                    {lembaga.bendahara_nama && (
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Bendahara</p>
                        <p className="font-bold text-zinc-800">{lembaga.bendahara_nama}</p>
                      </div>
                    )}
                    {lembaga.kontak_wa && (
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Kontak Info</p>
                        <p className="font-bold text-zinc-800">{lembaga.kontak_wa}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {lembaga.program_kerja && (
                <div className="flex-1 md:border-l border-zinc-100 md:pl-6">
                  <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 ${badgeColor}`}>Program Kerja</span>
                  <ul className="space-y-2">
                    {lembaga.program_kerja.split(/,|\n/).map((prog: string, i: number) => {
                      if (!prog.trim()) return null;
                      return (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 font-medium">
                          <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {prog.trim()}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Laporan Kas Lembaga */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-xl"><Wallet className="w-5 h-5" /></div>
                  <h2 className="text-lg font-black uppercase tracking-wider">Kas {lembaga.nama}</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-1"><TrendingUp className="w-3.5 h-3.5" /> Masuk</div>
                    <p className="font-black text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalMasuk)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1 text-rose-400 text-xs font-bold mb-1"><TrendingDown className="w-3.5 h-3.5" /> Keluar</div>
                    <p className="font-black text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalKeluar)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1 text-highlight text-xs font-bold mb-1"><Wallet className="w-3.5 h-3.5" /> Saldo</div>
                    <p className={`font-black text-lg ${(totalMasuk - totalKeluar) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalMasuk - totalKeluar)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat Kas Lembaga */}
            {kasLembaga && kasLembaga.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-700">Riwayat Transaksi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="text-left py-2.5 px-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                        <th className="text-left py-2.5 px-4 text-xs font-bold text-slate-500 uppercase">Keterangan</th>
                        <th className="text-right py-2.5 px-4 text-xs font-bold text-slate-500 uppercase">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kasLembaga.slice(0, 10).map((item) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="py-2.5 px-4 text-slate-800 font-semibold">{item.keterangan}</td>
                          <td className={`py-2.5 px-4 text-right font-black whitespace-nowrap ${item.jenis === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {item.jenis === 'masuk' ? '+' : '-'}{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.jumlah)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-b pb-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>
                Agenda Kegiatan
              </h2>
            </div>

            {!kegiatan || kegiatan.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-lg mb-1">Belum Ada Kegiatan</h3>
                <p className="text-sm text-muted-foreground">Belum ada agenda kegiatan yang tercatat untuk lembaga ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kegiatan.map((item) => (
                  <div key={item.id} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-muted/50 rounded-xl px-4 py-3 min-w-[100px] text-center border border-border">
                      <span className="text-xs font-bold text-muted-foreground uppercase mb-1">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-3xl font-black text-primary leading-none">
                        {new Date(item.tanggal).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badgeColor}`}>
                        {item.kategori}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mb-1">{item.judul}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.deskripsi}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-auto">
                        <div className="flex items-center text-xs font-medium text-slate-500">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {new Date(item.tanggal).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                        </div>
                        <div className="flex items-center text-xs font-medium text-slate-500">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {item.lokasi}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Pengumuman / Berita Lembaga */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <Megaphone className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>
                Informasi Terbaru
              </h2>
            </div>

            {!pengumuman || pengumuman.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">Belum ada informasi terbaru.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pengumuman.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.kategori === 'Penting' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.kategori}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{item.judul}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.konten}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
