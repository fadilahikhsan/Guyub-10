"use client";

import { useState } from "react";
import { Search, ShoppingBag, Wrench, Briefcase, MapPin, Store } from "lucide-react";
import Link from "next/link";

interface Umkm {
  id: string;
  nama_usaha: string;
  kategori: string;
  deskripsi: string;
  nomor_wa: string;
  foto_url?: string;
  alamat?: string;
  jam_buka?: string;
  profiles?: { rt: string };
}

export default function ClientUmkmList({ initialData }: { initialData: Umkm[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = [
    { name: "Semua", icon: null },
    { name: "Makanan & Minuman", icon: <ShoppingBag className="w-4 h-4 mr-2 text-accent" /> },
    { name: "Jasa & Perbaikan", icon: <Wrench className="w-4 h-4 mr-2 text-highlight" /> },
    { name: "Toko Kelontong", icon: <Briefcase className="w-4 h-4 mr-2 text-primary" /> },
  ];

  const filteredUmkm = initialData.filter((umkm) => {
    const matchesSearch = umkm.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          umkm.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "Semua") return matchesSearch;
    
    // Simple matching logic for categories
    if (activeCategory === "Makanan & Minuman" && (umkm.kategori.toLowerCase().includes("makanan") || umkm.kategori.toLowerCase().includes("minuman"))) {
      return matchesSearch;
    }
    if (activeCategory === "Jasa & Perbaikan" && (umkm.kategori.toLowerCase().includes("jasa") || umkm.kategori.toLowerCase().includes("perbaikan"))) {
      return matchesSearch;
    }
    if (activeCategory === "Toko Kelontong" && (umkm.kategori.toLowerCase().includes("toko") || umkm.kategori.toLowerCase().includes("kelontong") || umkm.kategori.toLowerCase().includes("warung"))) {
      return matchesSearch;
    }

    // Exact match fallback
    return matchesSearch && umkm.kategori.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <>
      {/* Header Search Section */}
      <section className="container mx-auto px-4 max-w-6xl mb-12">
        <div className="flex flex-col md:flex-row justify-end gap-8 -mt-20 relative z-10 pointer-events-none">
          <div className="relative w-full md:w-[400px] pointer-events-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari nasi uduk, tukang AC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Categories (Capsule Pills) */}
      <section className="container mx-auto px-4 max-w-6xl mb-12">
        <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center flex-shrink-0 px-6 py-2.5 rounded-full font-bold transition-all ${
                activeCategory === cat.name 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* UMKM List (Masonry-like Grid) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredUmkm.length > 0 ? (
            filteredUmkm.map((umkm) => {
              const bgClass = umkm.kategori.toLowerCase() === "makanan" || umkm.kategori.toLowerCase().includes("makanan")
                ? "from-accent/40 to-orange-500/40"
                : umkm.kategori.toLowerCase() === "jasa" || umkm.kategori.toLowerCase().includes("jasa")
                ? "from-highlight/40 to-yellow-500/40"
                : "from-primary/40 to-emerald-500/40";
                
              const rt = umkm.profiles?.rt || "00";

              return (
                <div key={umkm.id} className="bg-card border border-border/60 card-hover rounded-3xl overflow-hidden flex flex-col group h-full shadow-sm">
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {umkm.foto_url ? (
                      <img src={umkm.foto_url} alt={umkm.nama_usaha} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} group-hover:scale-110 transition-transform duration-700`}></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <Store className="w-24 h-24 text-foreground" />
                        </div>
                      </>
                    )}
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-border">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-foreground capitalize">{umkm.kategori}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>{umkm.nama_usaha}</h3>
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" /> 
                        {umkm.alamat ? `${umkm.alamat} (RT ${rt})` : `RT ${rt}`}
                      </p>
                      {umkm.jam_buka && (
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          🕒 {umkm.jam_buka}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground font-medium mb-6 flex-1 line-clamp-3">
                      {umkm.deskripsi}
                    </p>
                    <a 
                      href={`https://wa.me/${umkm.nomor_wa.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center w-full rounded-2xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 py-3 font-bold hover:bg-[#25D366] hover:text-white transition-colors"
                    >
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground font-medium bg-muted/50 rounded-3xl border border-border">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p>UMKM tidak ditemukan untuk pencarian ini.</p>
            </div>
          )}
        </div>

        {/* CTA Promosikan Usaha */}
        <div className="mt-20 relative overflow-hidden rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-primary/20 shadow-lg bg-primary">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-800 to-highlight opacity-90 -z-10"></div>
          
          <div className="max-w-xl mb-8 md:mb-0 relative z-10">
            <h2 className="text-3xl font-black mb-4 text-white" style={{ fontFamily: "var(--font-bitter)" }}>Punya Usaha atau Keahlian?</h2>
            <p className="text-lg font-medium text-white/90">
              Daftarkan usaha Anda di Guyub secara gratis! Biar seluruh warga RW tahu dan jualan Anda makin laris.
            </p>
          </div>
          <Link href="/umkm/daftar" className="w-full md:w-auto bg-highlight text-zinc-900 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 hover:bg-amber-400 transition-all shadow-xl relative z-10 text-center">
            Daftarkan Usaha Saya
          </Link>
        </div>
      </section>
    </>
  );
}
