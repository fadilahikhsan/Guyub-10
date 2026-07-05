import Link from "next/link";
import {
  ChevronRight,
  Users,
  Target,
  Eye,
  Phone,
  MapPin,
  Star,
  Map,
  Building,
  Heart,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function ProfilRWPage() {
  const supabase = await createClient();

  const [
    { data: profilRw },
    { data: lembagaList }
  ] = await Promise.all([
    supabase.from("profil_rw").select("*").limit(1).single(),
    supabase.from("lembaga").select("*").order("slug", { ascending: true })
  ]);

  const p = profilRw || {};
  const visi = p.visi || "Terwujudnya lingkungan RW 10 yang aman, nyaman, bersih, harmonis, dan mandiri dengan masyarakat yang aktif berpartisipasi dalam pembangunan berbasis kekeluargaan.";
  const misi = p.misi || [
    "Meningkatkan keamanan dan ketertiban lingkungan melalui sistem siskamling dan koordinasi yang efektif.",
    "Mendorong partisipasi aktif seluruh warga dalam kegiatan sosial, gotong royong, dan musyawarah.",
    "Memfasilitasi pelayanan administrasi kependudukan yang cepat, mudah, dan transparan bagi seluruh warga.",
    "Meningkatkan taraf ekonomi warga melalui pemberdayaan UMKM dan kegiatan ekonomi produktif.",
    "Menjaga kebersihan dan kelestarian lingkungan demi kesehatan dan kenyamanan bersama.",
    "Membangun komunikasi yang terbuka dan digital melalui Portal Guyub sebagai sarana informasi warga."
  ];

  // Helper to map icon based on slug
  const getIcon = (slug: string) => {
    if (slug.includes('rt')) return Building;
    if (slug.includes('pkk')) return Heart;
    if (slug.includes('posyandu')) return Shield;
    return Users;
  };

  const getColor = (slug: string) => {
    if (slug.includes('rt')) return "bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20";
    if (slug.includes('pkk')) return "bg-accent/10 text-accent hover:bg-accent hover:text-white border-accent/20";
    if (slug.includes('posyandu')) return "bg-highlight/10 text-highlight hover:bg-highlight hover:text-white border-highlight/20";
    return "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white border-secondary/20";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern">
        <div className="absolute top-8 right-8 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute top-16 right-16 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-20 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Profil RW</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-white leading-none">10</div>
                  <div className="text-xs font-bold text-white/80 uppercase tracking-widest mt-1">RW</div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 bg-highlight text-[#0f172a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-highlight/20">
                <Star className="w-3 h-3" />
                Profil Wilayah
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3" style={{ fontFamily: "var(--font-bitter)" }}>
                RW 10 Desa Cicadas
              </h1>
              <p className="text-white/90 text-lg font-medium max-w-xl">
                Rukun Warga 10 — pusat pelayanan, kebersamaan, dan aspirasi masyarakat Desa Cicadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">

        {/* Lingkungan RW 10 (Map & Deskripsi) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
              Profil Lingkungan
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Teks Deskripsi */}
            <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-primary mb-4">Wilayah RW 10 Desa Cicadas</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {p.sejarah || "Belum ada deskripsi sejarah."}
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl flex-shrink-0"><Users className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Populasi Warga</h4>
                    <p className="text-sm text-muted-foreground">{p.jumlah_rt || 4} RT dengan total {p.jumlah_kk || 350} KK ({p.jumlah_warga || 1200} Jiwa).</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-accent/10 text-accent p-2.5 rounded-xl flex-shrink-0"><Building className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Fasilitas Umum</h4>
                    <p className="text-sm text-muted-foreground">{p.jumlah_masjid || 2} Masjid, {p.jumlah_lapangan || 1} Lapangan, {p.fasilitas_lain || 'Fasilitas umum lainnya'}.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Map */}
            <div className="rounded-3xl overflow-hidden border border-border/60 shadow-sm h-[400px] lg:h-auto relative bg-muted flex items-center justify-center">
              <iframe
                src={p.maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15862.5!2d106.989!3d-6.469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjgnOC40IlMgMTA2wrA1OSczMi40IkU!5e0!3m2!1sen!2sid"}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Struktur Organisasi RW (Bagan) */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
              Struktur Pengurus Harian RW 10
            </h2>
          </div>

          <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm overflow-x-auto">
            <div className="min-w-[600px] flex flex-col items-center justify-center pb-8 pt-4">
              
              {/* Ketua RW */}
              <div className="flex flex-col items-center group cursor-default">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-highlight to-amber-600 overflow-hidden flex items-center justify-center shadow-lg ring-4 ring-white z-10 relative group-hover:scale-105 transition-transform`}>
                  {p.ketua_foto_url ? (
                    <img src={p.ketua_foto_url} alt="Ketua RW" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="bg-white border shadow-sm rounded-xl px-6 py-4 mt-[-10px] text-center w-64 pt-6">
                  <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 bg-highlight/20 text-highlight`}>Ketua RW</span>
                  <h3 className="font-black text-foreground">{p.ketua_nama || "Bpk. H. Ahmad Fauzi"}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {p.ketua_wa || "-"}</p>
                </div>
              </div>

              {/* Garis Vertikal */}
              <div className="w-0.5 h-12 bg-border relative">
                {/* Garis Horizontal ke Sekretaris & Bendahara */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-0.5 bg-border"></div>
              </div>

              {/* Cabang Sekretaris & Bendahara */}
              <div className="flex justify-between w-[400px] relative mt-0">
                <div className="w-0.5 h-6 bg-border absolute left-0 top-0"></div>
                <div className="w-0.5 h-6 bg-border absolute right-0 top-0"></div>

                {/* Sekretaris RW */}
                <div className="flex flex-col items-center absolute -left-[100px] top-6 group cursor-default">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg ring-4 ring-white z-10 relative group-hover:scale-105 transition-transform`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-xl px-4 py-3 mt-[-10px] text-center w-52 pt-5">
                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 bg-primary/20 text-primary`}>Sekretaris RW</span>
                    <h3 className="font-bold text-sm text-foreground leading-tight">{p.sekretaris_nama || "Bpk. Dedi Kurniawan"}</h3>
                  </div>
                </div>

                {/* Bendahara RW */}
                <div className="flex flex-col items-center absolute -right-[100px] top-6 group cursor-default">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center shadow-lg ring-4 ring-white z-10 relative group-hover:scale-105 transition-transform`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-xl px-4 py-3 mt-[-10px] text-center w-52 pt-5">
                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 bg-accent/20 text-accent`}>Bendahara RW</span>
                    <h3 className="font-bold text-sm text-foreground leading-tight">{p.bendahara_nama || "Ibu Siti Rahayu"}</h3>
                  </div>
                </div>
              </div>
              <div className="h-40"></div>
            </div>
          </div>
        </section>

        {/* RT & Lembaga (Link Dinamis) */}
        {lembagaList && lembagaList.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
                Daftar RT & Lembaga
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lembagaList.map((lembaga) => {
                const Icon = getIcon(lembaga.slug);
                return (
                <Link key={lembaga.slug} href={`/lembaga/${lembaga.slug}`} className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group shadow-sm ${getColor(lembaga.slug)}`}>
                  <Icon className="w-10 h-10 mb-3" />
                  <span className="font-bold text-base text-center line-clamp-1">{lembaga.nama}</span>
                  <span className="text-xs opacity-80 mt-1 flex items-center gap-1 group-hover:underline">Lihat Profil <ChevronRight className="w-3 h-3" /></span>
                </Link>
              )})}
            </div>
          </section>
        )}

        {/* Visi & Misi */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
              Visi & Misi
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-highlight p-2.5 rounded-xl"><Eye className="w-5 h-5 text-[#0f172a]" /></div>
                  <h3 className="text-xl font-black uppercase tracking-wide">Visi</h3>
                </div>
                <p className="text-white/90 leading-relaxed font-medium text-base">&ldquo;{visi}&rdquo;</p>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-accent/20 p-2.5 rounded-xl"><Target className="w-5 h-5 text-accent" /></div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Misi</h3>
              </div>
              <ul className="space-y-3">
                {misi.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary text-xs font-black rounded-full flex items-center justify-center mt-0.5">{i + 1}</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
