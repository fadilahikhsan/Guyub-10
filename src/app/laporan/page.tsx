import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Wrench, Clock, MapPin, Search } from "lucide-react";
import LaporanForm from "./LaporanForm";

export const revalidate = 0;

export default async function LaporanPage() {
  const supabase = await createClient();

  const { data: laporanList } = await supabase
    .from("laporan_infrastruktur")
    .select("*")
    .order("created_at", { ascending: false });

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "diproses":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "dilaporkan":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden min-h-[280px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&q=80"
            alt="Laporan Warga Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-[rgba(13,33,25,0.93)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Laporan Warga</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
            Laporan Infrastruktur Warga
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto">
            Laporkan kerusakan infrastruktur seperti jalan berlubang, lampu mati, atau masalah lingkungan lainnya di RW 10 untuk segera ditindaklanjuti.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Kiri: Form Laporan */}
          <div className="w-full lg:w-[450px] shrink-0">
            <LaporanForm />
          </div>

          {/* Kanan: Daftar Laporan */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-black text-foreground border-b border-border/60 pb-4" style={{ fontFamily: "var(--font-bitter)" }}>
              Daftar Laporan Warga
            </h2>

            {laporanList && laporanList.length > 0 ? (
              <div className="space-y-4">
                {laporanList.map((laporan) => (
                  <div key={laporan.id} className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    
                    {laporan.foto_url ? (
                      <div className="w-full md:w-40 h-40 shrink-0">
                        <img src={laporan.foto_url} alt="Foto Laporan" className="w-full h-full object-cover rounded-2xl border border-border/50" />
                      </div>
                    ) : (
                      <div className="w-full md:w-40 h-40 shrink-0 bg-muted/50 rounded-2xl border border-border flex items-center justify-center">
                        <Wrench className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyle(laporan.status)}`}>
                          {laporan.status}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {formatTanggal(laporan.created_at)}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{laporan.kategori}</span>
                        <h3 className="text-lg font-bold text-foreground leading-tight mt-1 line-clamp-2">
                          {laporan.deskripsi}
                        </h3>
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-auto">
                        {laporan.lokasi && (
                          <div className="flex items-start text-xs font-medium text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5 text-accent/60" />
                            {laporan.lokasi}
                          </div>
                        )}
                        <div className="flex items-center text-xs font-medium text-muted-foreground">
                          <span className="font-bold mr-1">Pelapor:</span> {laporan.nama_pelapor}
                        </div>
                      </div>

                      {laporan.catatan_admin && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-border text-sm">
                          <span className="font-bold text-primary block mb-1">Tanggapan Admin:</span>
                          <p className="text-muted-foreground font-medium">{laporan.catatan_admin}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-1">Belum Ada Laporan</h3>
                <p className="text-sm text-muted-foreground">Belum ada laporan infrastruktur yang diajukan oleh warga.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
