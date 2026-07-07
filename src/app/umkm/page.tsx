import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ClientUmkmList from "./ClientUmkmList";

export const revalidate = 60;

export default async function UMKMPage() {
  const supabase = await createClient();
  const { data: umkmList } = await supabase
    .from("umkm")
    .select(`
      *,
      profiles ( rt )
    `)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[280px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="UMKM Warga Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-[rgba(13,33,25,0.93)]" />

        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-20 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">UMKM & Jasa Warga</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md border border-white/20">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3" style={{ fontFamily: "var(--font-bitter)" }}>
                Pusat Ekonomi<br />
                <span className="text-highlight">Warga RW 10</span>
              </h1>
              <p className="text-white/90 text-lg font-medium max-w-2xl">
                Dukung tetangga kita! Temukan produk makanan, jasa perbaikan, dan keahlian warga asli secara langsung.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClientUmkmList initialData={umkmList || []} />
    </div>
  );
}

