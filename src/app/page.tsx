import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  FileText,
  Store,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Users,
  Activity,
  Megaphone,
  TrendingUp,
  ArrowRight,
  Zap,
  MapPin,
  Clock,
  ChevronDown
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const WidgetBar = dynamic(() => import("@/components/WidgetBar"), { ssr: false });
const InfografisWarga = dynamic(() => import("@/components/InfografisWarga").then(mod => mod.InfografisWarga), { 
  loading: () => <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">Memuat Statistik...</div> 
});

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: articlesList },
    { data: profilRw },
    { data: tickerList },
    { data: kegiatanList },
    { data: umkmList },
    { data: wargaData }
  ] = await Promise.all([
    supabase.from("pengumuman").select("id, judul, konten, kategori, foto_url, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("profil_rw").select("*").limit(1).single(),
    supabase.from("ticker").select("*").eq("aktif", true).order("urutan", { ascending: true }),
    supabase.from("kegiatan").select("*").gte("tanggal", new Date().toISOString()).order("tanggal", { ascending: true }).limit(3),
    supabase.from("umkm").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(4),
    supabase.from("warga").select("rt, jenis_kelamin, tanggal_lahir, no_kk")
  ]);

  const stats = [
    {
      icon: Users,
      label: "Total Warga",
      value: profilRw?.jumlah_warga?.toString() || "0",
      unit: "Jiwa",
      color: "text-primary",
      bg: "bg-green-50",
    },
    {
      icon: Activity,
      label: "Total KK",
      value: profilRw?.jumlah_kk?.toString() || "0",
      unit: "Keluarga",
      color: "text-accent",
      bg: "bg-orange-50",
    },
    {
      icon: Store,
      label: "UMKM Terdaftar",
      value: umkmList?.length?.toString() || "0",
      unit: "Usaha",
      color: "text-highlight",
      bg: "bg-amber-50",
    },
    {
      icon: Users,
      label: "Rukun Tetangga",
      value: profilRw?.jumlah_rt?.toString() || "0",
      unit: "RT",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    }
  ];

  // Hitung statistik warga
  const totalWarga = wargaData?.length || 0;
  const noKkSet = new Set(wargaData?.map(w => w.no_kk).filter(Boolean));
  const totalKK = noKkSet.size;

  let countLaki = 0;
  let countPerempuan = 0;
  const rtCounts: Record<string, number> = {};
  const ageCounts = { '0-5 (Balita)': 0, '6-12 (Anak)': 0, '13-17 (Remaja)': 0, '18-59 (Dewasa)': 0, '60+ (Lansia)': 0 };

  wargaData?.forEach(w => {
    // Gender
    if (w.jenis_kelamin === 'L') countLaki++;
    else if (w.jenis_kelamin === 'P') countPerempuan++;

    // RT
    const rt = w.rt ? String(w.rt).replace(/^0+/, '') : '0';
    rtCounts[`RT ${rt}`] = (rtCounts[`RT ${rt}`] || 0) + 1;

    // Age
    if (w.tanggal_lahir) {
      const birthDate = new Date(w.tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
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

  const rtData = Object.entries(rtCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }));

  const infografisData = {
    totalWarga,
    totalKK,
    genderData,
    rtData,
    ageData
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Gunakan foto desa & industri sebagai background (fallback)
  const heroBg = profilRw?.hero_foto_url || "/desa-industri-bg.png";

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Hero Section (FULL VIEWPORT) ─────────────── */}
      <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex flex-col justify-end fade-in-up">
        {/* Background Layer */}
        {heroBg ? (
          <div className="absolute inset-0">
            <Image 
              src={heroBg} 
              alt="Hero Background" 
              fill 
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern" />
        )}
        
        {/* Dark Overlay Gradient (Transparent to Dark Green) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[rgba(13,26,19,0.9)]" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 max-w-6xl pb-12 pt-[220px] md:pt-[260px] lg:pt-[280px] text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-highlight text-[#0f172a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-highlight/20">
              <MapPin className="w-3 h-3" />
              Portal Resmi Warga
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-xl" style={{ fontFamily: "var(--font-bitter)" }}>
              Selamat datang di <br className="hidden md:block" />
              <span className="text-highlight">RW 10 Desa Cicadas</span>
            </h1>
            <p className="text-white/90 text-base md:text-xl font-medium mb-8 leading-relaxed drop-shadow-md max-w-xl">
              {profilRw?.visi || "Membangun lingkungan yang aman, nyaman, bersih, harmonis, dan mandiri dengan masyarakat yang aktif berpartisipasi berbasis kekeluargaan."}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link href="/kegiatan" className="bg-highlight hover:bg-amber-500 text-[#0f172a] font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-highlight/30 active:scale-95 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Lihat agenda warga
              </Link>
              <Link href="/profil" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 flex items-center gap-2">
                <Users className="w-5 h-5" /> Profil RW
              </Link>
            </div>
          </div>
        </div>

        {/* Chevron Bounce Indicator */}
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>

        {/* ── Running Text / Ticker ───────────────────── */}
        {tickerList && tickerList.length > 0 && (
          <div className="w-full bg-primary/90 backdrop-blur-sm text-white overflow-hidden py-2.5 border-t border-white/10 flex items-center shadow-sm relative z-40">
            <div className="bg-highlight text-[#0f172a] px-4 py-1 font-black text-xs uppercase z-10 whitespace-nowrap tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              Info Penting
            </div>
            <div className="whitespace-nowrap animate-marquee flex items-center pl-4 text-sm font-medium">
              {tickerList.map((t, idx) => (
                <span key={idx} className="mx-10">{t.konten}</span>
              ))}
            </div>
          </div>
        )}

        {/* WidgetBar at the very bottom of Hero */}
        <WidgetBar />
      </section>

      {/* ── Berita Terkini Section (Separate) ────────── */}
      <section className="bg-muted py-16 md:py-24 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
                Berita Terkini
              </h2>
            </div>
            <Link href="/informasi" className="text-sm font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors group">
              Semua Berita <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articlesList && articlesList.slice(0, 4).map((article) => {
              const isPenting = article.kategori.toLowerCase() === "penting" || article.kategori.toLowerCase() === "darurat";
              const categoryStyle = isPenting ? "bg-red-100 text-red-700 border-red-200" : "bg-primary/10 text-primary border-primary/20";
              
              return (
              <article key={article.id} className="bg-card rounded-2xl overflow-hidden shadow-sm card-hover border border-border/60 fade-in-up flex flex-col">
                {article.foto_url && (
                  <Link href="/informasi" className="block aspect-[16/9] w-full overflow-hidden border-b border-border/50 relative">
                    <Image 
                      src={article.foto_url} 
                      alt={article.judul} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </Link>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                      {article.kategori}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 leading-snug hover:text-accent transition-colors line-clamp-3" style={{ fontFamily: "var(--font-bitter)" }}>
                    <Link href="/informasi">{article.judul}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                    {article.konten}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(article.created_at)}
                    </span>
                  </div>
                </div>
              </article>
            )})}
          </div>
        </div>
      </section>

      {/* ── Infografis Warga ───────────────────────── */}
      <InfografisWarga data={infografisData} />

      {/* ── Main Content Container ────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Agenda) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Agenda Terdekat Section */}
            {kegiatanList && kegiatanList.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-primary rounded-full" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
                      Agenda Terdekat
                    </h2>
                  </div>
                  <Link href="/kegiatan" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group">
                    Semua Agenda <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kegiatanList.map((k) => (
                    <div key={k.id} className="bg-card border border-border/60 p-5 rounded-2xl shadow-sm hover:border-highlight transition-colors flex flex-col">
                      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                        <div className="text-center bg-highlight/10 rounded-xl px-3 py-1.5 border border-highlight/20 text-accent">
                          <p className="text-xs font-bold uppercase">{new Date(k.tanggal).toLocaleDateString("id-ID", { month: "short" })}</p>
                          <p className="text-xl font-black leading-none">{new Date(k.tanggal).getDate()}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-1 rounded uppercase tracking-wider">{k.kategori}</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm mb-3 line-clamp-2">{k.judul}</h4>
                      <div className="mt-auto space-y-1.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/60"/> {new Date(k.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent/60"/> {k.lokasi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Access Widget (Layanan Warga) moved to Left Column on Desktop for better flow or keep it right? PRD says "Sisa section lain ... TETAP seperti urutan di PRD". I will put it in right column. */}

          </div>

          {/* ── Right Column (Sidebar) ────────────────── */}
          <div className="space-y-6">

            {/* Quick Access Widget (Layanan Warga) */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <div className="bg-primary p-4 border-b border-primary/20">
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Layanan Warga
                </h3>
                <p className="text-xs text-white/70 mt-0.5">Akses cepat layanan digital</p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { href: "/layanan", icon: FileText, label: "Surat Pengantar", sub: "Pengajuan online 24/7", color: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" },
                  { href: "/umkm", icon: Store, label: "Direktori UMKM", sub: "Belanja dari warga lokal", color: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white" },
                  { href: "/kas", icon: Activity, label: "Laporan Kas", sub: "Transparansi keuangan", color: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white" },
                  { href: "/aspirasi", icon: Megaphone, label: "Papan Aspirasi", sub: "Kirim masukan/saran", color: "bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-muted transition-all group">
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.sub}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}

                {/* Emergency button */}
                <Link href="/darurat" className="flex items-center p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-destructive hover:border-destructive group transition-all duration-200 mt-4">
                  <div className="p-2 rounded-lg mr-3 bg-red-100 text-destructive group-hover:bg-red-400 group-hover:text-white transition-all duration-200">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-destructive group-hover:text-white transition-colors">Lapor Darurat</div>
                    <div className="text-xs text-red-400 group-hover:text-red-100 transition-colors">Kontak penting 24 jam</div>
                  </div>
                  <span className="ml-auto w-2 h-2 bg-destructive group-hover:bg-white rounded-full animate-pulse transition-colors" />
                </Link>
              </div>
            </div>

            {/* Sambutan Ketua RW */}
            {profilRw && (
              <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <div className="bg-secondary p-4 border-b border-border/10">
                  <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                    Sambutan Ketua RW
                  </h3>
                </div>
                <div className="p-5 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-muted rounded-full border-4 border-white shadow-lg overflow-hidden relative">
                      {profilRw.ketua_foto_url ? (
                        <Image src={profilRw.ketua_foto_url} alt="Ketua RW" fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary"><Users className="w-8 h-8"/></div>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 bg-highlight text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                      RW
                    </span>
                  </div>
                  <h4 className="font-black text-base text-foreground">{profilRw.ketua_nama}</h4>
                  <p className="text-xs text-accent mb-4 uppercase tracking-wider font-bold">
                    Ketua RW 10
                  </p>
                  <blockquote className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-highlight/50 pl-3 text-left">
                    &ldquo;{profilRw.ketua_sambutan}&rdquo;
                  </blockquote>
                </div>
              </div>
            )}

            {/* Stats Widget */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <div className="bg-primary p-4 border-b border-primary/20">
                <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                  Statistik Wilayah
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground font-medium truncate">
                        {stat.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-black text-base ${stat.color}`}>{stat.value}</span>
                      <span className="text-xs text-muted-foreground ml-1">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UMKM Preview */}
            {umkmList && umkmList.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <div className="bg-accent p-4 flex justify-between items-center border-b border-accent/20">
                  <h3 className="text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-bitter)" }}>
                    UMKM Unggulan
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {umkmList.map(u => (
                    <Link key={u.id} href="/umkm" className="group block aspect-square rounded-xl overflow-hidden bg-muted relative border border-border/50">
                      {u.foto_url ? (
                        <Image src={u.foto_url} alt={u.nama_usaha} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Store className="w-8 h-8"/></div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                        <p className="text-white text-xs font-bold line-clamp-1">{u.nama_usaha}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <Link href="/umkm" className="block text-center text-xs font-bold text-accent hover:text-white bg-accent/10 hover:bg-accent py-2.5 rounded-lg border border-accent/20 transition-colors">Lihat Semua UMKM</Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
