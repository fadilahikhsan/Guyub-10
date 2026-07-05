import Link from "next/link";
import { ChevronRight, PhoneCall, AlertTriangle, Flame, HeartPulse, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function DaruratPage() {
  const supabase = await createClient();
  const { data: profilRw } = await supabase.from("profil_rw").select("ketua_nama, nomor_darurat").limit(1).single();

  const ketuaNama = profilRw?.ketua_nama || "Ketua RW";
  const nomorDarurat = profilRw?.nomor_darurat || "081234567890";

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-destructive/10 blur-[100px] rounded-full -z-10"></div>

      <section className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="flex items-center text-sm font-bold text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Kontak Darurat</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center text-destructive drop-shadow-[0_0_15px_rgba(255,75,75,0.5)]">
          <AlertTriangle className="mr-4 w-12 h-12" />
          Darurat
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
          Satu tombol panggilan otomatis untuk respons cepat.
        </p>
      </section>

      <section className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Ambulans */}
          <a href="tel:118" className="glass p-6 md:p-8 rounded-3xl border-destructive/20 hover:border-destructive/50 hover:bg-destructive/5 transition-all flex items-center justify-between shadow-[0_0_20px_rgba(255,75,75,0.1)] hover:shadow-[0_0_30px_rgba(255,75,75,0.3)] group cursor-pointer">
            <div>
              <div className="bg-destructive/20 text-destructive w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-1">Ambulan</h2>
              <p className="text-muted-foreground font-medium">118 / 119</p>
            </div>
            <div className="bg-destructive text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,75,75,0.5)] group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

          {/* Card 2: Damkar */}
          <a href="tel:113" className="glass p-6 md:p-8 rounded-3xl border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all flex items-center justify-between shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] group cursor-pointer">
            <div>
              <div className="bg-orange-500/20 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-1">Pemadam</h2>
              <p className="text-muted-foreground font-medium">113</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

          {/* Card 3: Polisi */}
          <a href="tel:110" className="glass p-6 md:p-8 rounded-3xl border-accent/20 hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-between shadow-[0_0_20px_rgba(201,98,43,0.1)] hover:shadow-[0_0_30px_rgba(201,98,43,0.3)] group cursor-pointer">
            <div>
              <div className="bg-accent/20 text-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-1">Polisi</h2>
              <p className="text-muted-foreground font-medium">110</p>
            </div>
            <div className="bg-accent text-white p-4 rounded-full shadow-[0_0_15px_rgba(201,98,43,0.5)] group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

          {/* Card 4: Ketua RW */}
          <a href={`tel:${nomorDarurat}`} className="glass p-6 md:p-8 rounded-3xl border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between shadow-[0_0_20px_rgba(27,67,50,0.1)] hover:shadow-[0_0_30px_rgba(27,67,50,0.3)] group cursor-pointer">
            <div>
              <div className="bg-primary/20 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-1">Ketua RW</h2>
              <p className="text-muted-foreground font-medium">{ketuaNama}</p>
            </div>
            <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-[0_0_15px_rgba(27,67,50,0.5)] group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

        </div>
      </section>
    </div>
  );
}
