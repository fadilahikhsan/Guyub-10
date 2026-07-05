import Link from "next/link";
import { ChevronRight, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import KasClient from "./KasClient";

export const revalidate = 60;

export default async function KasPage() {
  const supabase = await createClient();

  const { data: kasList } = await supabase
    .from("kas")
    .select("*")
    .order("tanggal", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Laporan Kas</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
            Transparansi Keuangan
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto">
            Laporan penerimaan dan pengeluaran kas RW 10 secara transparan dan akuntabel.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12 -mt-16 relative z-20">
        <KasClient initialData={kasList || []} />
      </div>
    </div>
  );
}
