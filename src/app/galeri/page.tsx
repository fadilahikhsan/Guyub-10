import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import GalleryClient from "./GalleryClient";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function GaleriPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("galeri")
    .select("*")
    .order("created_at", { ascending: false });

  // Map to format expected by GalleryClient
  const formattedItems = (galleryItems || []).map(item => ({
    id: item.id,
    url: item.foto_url,
    title: item.judul,
    category: item.album || "Umum"
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-navy to-black geo-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Galeri</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <Camera className="w-8 h-8 text-amber-400" />
          </div>
          
          <h1
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-bitter)" }}
          >
            Galeri Warga
          </h1>
          <p className="text-slate-300 text-lg font-medium max-w-2xl mx-auto">
            Dokumentasi momen-momen kebersamaan, kegiatan, dan pembangunan di lingkungan RW 10 Desa Cicadas.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        {formattedItems.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200">
            <Camera className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-bold text-xl text-zinc-700">Belum ada foto</h3>
            <p className="text-zinc-500">Galeri foto warga masih kosong.</p>
          </div>
        ) : (
          <GalleryClient items={formattedItems} />
        )}
      </div>
    </div>
  );
}
