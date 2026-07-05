import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ClientUmkmList from "./ClientUmkmList";

export const revalidate = 0;

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
    <div className="flex flex-col min-h-screen pt-24 pb-20 bg-background">
      {/* Header Section */}
      <section className="container mx-auto px-4 max-w-6xl mb-12">
        <div className="flex items-center text-sm font-bold text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">UMKM & Jasa Warga</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>Pusat Ekonomi <br/><span className="text-primary">Warga RW 10</span></h1>
            <p className="text-lg text-muted-foreground font-medium">
              Dukung tetangga kita! Temukan produk makanan, jasa perbaikan, dan keahlian warga asli secara langsung.
            </p>
          </div>
        </div>
      </section>

      <ClientUmkmList initialData={umkmList || []} />
    </div>
  );
}
