import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Users, Building, Heart, Shield, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function LembagaIndexPage() {
  const supabase = await createClient();
  const { data: lembagaList } = await supabase
    .from("lembaga")
    .select("slug, nama, deskripsi, ketua_nama, ketua_foto_url")
    .order("slug", { ascending: true });

  const filteredLembaga = lembagaList?.filter(l => !l.slug.startsWith('rt')) || [];

  const getIcon = (slug: string) => {
    if (slug.includes("pkk")) return Heart;
    if (slug.includes("posyandu")) return Shield;
    if (slug.includes("rt")) return Building;
    return Users;
  };

  const getGradient = (slug: string) => {
    if (slug.includes("pkk")) return "from-pink-500 to-rose-600";
    if (slug.includes("posyandu")) return "from-emerald-500 to-teal-600";
    if (slug.includes("karang-taruna") || slug.includes("pokja")) return "from-indigo-500 to-purple-700";
    if (slug.includes("rt")) return "from-sky-500 to-blue-700";
    return "from-primary to-secondary";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[300px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="Lembaga Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-[rgba(13,33,25,0.95)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-20 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Lembaga RW</span>
          </div>
          <div className="max-w-2xl mx-auto">
            <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              Struktur Organisasi
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
              Lembaga & Organisasi RW 10
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Kenali pengurus dan organisasi kemasyarakatan yang aktif di lingkungan RW 10 Desa Cicadas.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Lembaga */}
      <section className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        {filteredLembaga.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-bold text-lg">Data lembaga belum tersedia.</p>
            <p className="text-sm">Silakan hubungi admin untuk mengisi data lembaga.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLembaga.map((lembaga) => {
              const Icon = getIcon(lembaga.slug);
              const gradient = getGradient(lembaga.slug);
              return (
                <Link
                  key={lembaga.slug}
                  href={`/lembaga/${lembaga.slug}`}
                  className="group bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className={`relative bg-gradient-to-br ${gradient} p-6 flex items-center gap-4`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 flex-shrink-0 overflow-hidden">
                      {lembaga.ketua_foto_url ? (
                        <img
                          src={lembaga.ketua_foto_url}
                          alt={lembaga.ketua_nama ?? lembaga.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <h2 className="text-lg font-black text-white leading-tight" style={{ fontFamily: "var(--font-bitter)" }}>
                      {lembaga.nama}
                    </h2>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {lembaga.ketua_nama && (
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ketua</p>
                    )}
                    {lembaga.ketua_nama && (
                      <p className="font-black text-foreground text-sm mb-3">{lembaga.ketua_nama}</p>
                    )}
                    {lembaga.deskripsi && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {lembaga.deskripsi}
                      </p>
                    )}
                    <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all gap-1">
                      Lihat Detail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
