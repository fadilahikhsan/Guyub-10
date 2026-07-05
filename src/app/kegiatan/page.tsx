import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Calendar, MapPin, Clock, Info, LayoutList, CalendarDays } from "lucide-react";
import KalenderView from "./KalenderView";

export const revalidate = 0; // Dynamic route

export default async function KegiatanPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const resolvedParams = await searchParams;
  const view = resolvedParams.view || "list";
  const supabase = await createClient();

  // Ambil semua data kegiatan untuk kalender
  const { data: allKegiatanData } = await supabase
    .from("kegiatan")
    .select("*")
    .order("tanggal", { ascending: true });

  // Ambil data kegiatan mendatang untuk list view
  const kegiatan = allKegiatanData?.filter((k) => new Date(k.tanggal) >= new Date(new Date().setHours(0,0,0,0))) || [];

  // Ambil info penting dari profil_rw
  const { data: profilRw } = await supabase.from("profil_rw").select("info_penting_kegiatan").limit(1).single();
  const infoPenting = profilRw?.info_penting_kegiatan || "Seluruh warga diharapkan partisipasi aktifnya dalam setiap kegiatan lingkungan untuk mewujudkan RW yang Guyub dan Rukun.";

  // Helper untuk format tanggal & waktu
  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatWaktu = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Kategori colors
  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Pengajian":
        return "bg-primary/10 text-primary border-primary/20";
      case "Kerja Bakti":
        return "bg-highlight/10 text-highlight border-highlight/20";
      case "Posyandu":
        return "bg-red-100 text-red-700 border-red-200";
      case "Karang Taruna":
        return "bg-accent/10 text-accent border-accent/20";
      case "Rapat":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern">
        <div className="absolute top-8 right-8 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Agenda Kegiatan</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-3"
            style={{ fontFamily: "var(--font-bitter)" }}
          >
            Agenda Kegiatan Warga
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl">
            Pantau jadwal kegiatan rutin dan insidental di lingkungan RW 10 Desa Cicadas. Mari bersama-sama berpartisipasi untuk lingkungan yang lebih baik.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-4">
          <Link 
            href="/kegiatan?view=list" 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
              view === "list" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <LayoutList className="w-4 h-4" /> Mode Daftar
          </Link>
          <Link 
            href="/kegiatan?view=calendar" 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
              view === "calendar" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Mode Kalender
          </Link>
        </div>

        {view === "list" ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* List Kegiatan (Kiri) */}
            <div className="flex-1 space-y-6">
              {kegiatan.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Belum Ada Kegiatan</h3>
                  <p className="text-sm text-muted-foreground">Saat ini tidak ada jadwal kegiatan mendatang yang tercatat.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {kegiatan.map((item) => (
                    <div key={item.id} className="bg-card border border-border/60 hover:border-primary/50 transition-colors rounded-2xl p-5 shadow-sm card-hover flex flex-col sm:flex-row gap-5">
                      
                      {/* Date Block */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-muted/50 rounded-xl px-4 py-3 min-w-[100px] text-center border border-border">
                        <span className="text-xs font-bold text-muted-foreground uppercase mb-1">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", { month: "short" })}
                        </span>
                        <span className="text-3xl font-black text-primary leading-none">
                          {new Date(item.tanggal).getDate()}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground mt-1">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", { weekday: "short" })}
                        </span>
                      </div>

                      {/* Image Block */}
                      {item.foto_url && (
                        <div className="w-full sm:w-32 h-32 flex-shrink-0">
                          <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover rounded-xl border border-border" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 ${getCategoryColor(item.kategori)}`}>
                          {item.kategori}
                        </span>
                        <h3 className="text-lg font-bold text-foreground leading-tight mb-2">
                          {item.judul}
                        </h3>
                        {item.deskripsi && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.deskripsi}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 mt-auto">
                          <div className="flex items-center text-xs font-medium text-slate-500">
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {formatWaktu(item.tanggal)} WIB
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

            {/* Sidebar Kalender Mini (Kanan) */}
            <div className="w-full md:w-[320px] flex-shrink-0 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-lg border-b pb-3 mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
                  Info Penting
                </h3>
                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>{infoPenting}</p>
                </div>
              </div>

              {/* Ilustrasi atau Call to Action */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="relative z-10">
                  <Calendar className="w-10 h-10 text-white/80 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">Punya Usulan Kegiatan?</h3>
                  <p className="text-xs text-white/80 mb-4 line-clamp-2">Sampaikan ke pengurus RT masing-masing untuk diagendakan di tingkat RW.</p>
                  <Link href="/profil" className="inline-block bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
                    Hubungi Pengurus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <KalenderView data={allKegiatanData || []} />
        )}
      </div>
    </div>
  );
}
