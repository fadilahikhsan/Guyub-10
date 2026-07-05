import Link from "next/link";
import { ChevronRight, Box, MapPin, Clock, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function FasilitasPage() {
  const supabase = await createClient();
  const { data: fasilitas } = await supabase.from("fasilitas").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Fasilitas</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <Box className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
            Fasilitas Warga
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto">
            Daftar fasilitas umum dan inventaris RW 10 yang dapat digunakan dan dipinjam oleh seluruh warga.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!fasilitas || fasilitas.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground font-medium bg-muted rounded-2xl border border-border">
              Belum ada data fasilitas.
            </div>
          ) : (
            fasilitas.map(f => (
              <div key={f.id} className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col group">
                <div className="h-48 overflow-hidden relative bg-muted">
                  {f.foto_url ? (
                    <img src={f.foto_url} alt={f.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Box className="w-12 h-12"/></div>
                  )}
                  {f.bisa_dipinjam && (
                    <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Bisa Dipinjam
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-black text-xl text-foreground mb-2" style={{ fontFamily: "var(--font-bitter)" }}>{f.nama}</h3>
                  <div className="flex flex-col gap-2 mb-4 text-xs font-bold text-muted-foreground">
                    {f.lokasi && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {f.lokasi}</div>}
                    {f.jam_operasional && <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {f.jam_operasional}</div>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-4">
                    {f.deskripsi}
                  </p>
                  
                  {f.cara_peminjaman && (
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 mb-4">
                      <p className="text-[10px] font-black text-primary uppercase mb-1">Cara Pinjam/Gunakan</p>
                      <p className="text-xs text-foreground font-medium">{f.cara_peminjaman}</p>
                    </div>
                  )}

                  {f.bisa_dipinjam && (
                    <Link href="/layanan" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl text-center text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-auto">
                      Ajukan Peminjaman <ExternalLink className="w-4 h-4"/>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
