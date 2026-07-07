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
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
              <div className={`bg-gradient-to-r ${color} p-5`}>
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Profil {lembaga.nama}
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lembaga.ketua_nama && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ketua</p>
                      <p className="font-black text-slate-800">{lembaga.ketua_nama}</p>
                    </div>
                  )}
                  {lembaga.sekretaris_nama && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Sekretaris</p>
                      <p className="font-black text-slate-800">{lembaga.sekretaris_nama}</p>
                    </div>
                  )}
                  {lembaga.bendahara_nama && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Bendahara</p>
                      <p className="font-black text-slate-800">{lembaga.bendahara_nama}</p>
                    </div>
                  )}
                  {lembaga.kontak_wa && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Kontak Info</p>
                      <p className="font-black text-slate-800">{lembaga.kontak_wa}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
              
            {lembaga.program_kerja && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
                <div className={`bg-slate-800 p-5`}>
                  <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                    Program Kerja
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {lembaga.program_kerja.split(/,|\n/).map((prog: string, i: number) => {
                      if (!prog.trim()) return null;
                      return (
                        <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0" />
                          <span className="text-sm text-slate-700 font-bold">{prog.trim()}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Ringkasan Kas Lembaga */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-slate-800 p-5">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-bitter)" }}>
                  <Wallet className="w-4 h-4" /> Kas Lembaga
                </h3>
              </div>
              <div className="p-5 text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-bold mb-1"><TrendingUp className="w-3.5 h-3.5" /> Masuk</div>
                    <p className="font-black text-slate-800 text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalMasuk)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-rose-600 text-xs font-bold mb-1"><TrendingDown className="w-3.5 h-3.5" /> Keluar</div>
                    <p className="font-black text-slate-800 text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalKeluar)}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-white/70 text-xs font-bold mb-1"><Wallet className="w-3.5 h-3.5" /> Saldo</div>
                    <p className={`font-black text-white text-lg`}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalMasuk - totalKeluar)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat Kas Lembaga */}
            {kasLembaga && kasLembaga.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-6">
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

            {/* Agenda Lembaga */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
              <div className="bg-primary p-5">
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Agenda Kegiatan
                </h3>
              </div>
              <div className="p-4">
                {!kegiatan || kegiatan.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Belum ada agenda kegiatan.</p>
                ) : (
                  <div className="space-y-4">
                    {kegiatan.map((k) => (
                      <div key={k.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                          <span className="text-[10px] font-bold uppercase">{new Date(k.tanggal).toLocaleDateString("id-ID", { month: "short" })}</span>
                          <span className="text-lg font-black">{new Date(k.tanggal).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-slate-800 line-clamp-1">{k.judul}</p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1 truncate">
                            <Clock className="w-3 h-3" /> {new Date(k.tanggal).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pengumuman / Berita Lembaga */}
          <div className="space-y-6">
            {/* Info Berita */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
              <div className={`bg-gradient-to-r ${color} p-5`}>
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Info Berita Terbaru
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {pengumuman && pengumuman.length > 0 ? (
                  pengumuman.map((item) => (
                    <Link key={item.id} href={`/informasi/${item.id}`} className="block group">
                      <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-colors">
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                          {item.gambar_url ? (
                            <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Megaphone className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                            {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <h4 className="font-black text-slate-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.judul}</h4>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Megaphone className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Belum ada pengumuman terbaru.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
