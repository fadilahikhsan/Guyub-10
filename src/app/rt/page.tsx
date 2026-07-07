import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60;

export default async function RtIndexPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const rtList = ['01', '02', '03', '04', '05', '06', '07', '08'];
  
  const [
    { data: profilRt },
    { data: wargaList }
  ] = await Promise.all([
    supabase.from("profil_rt").select("*"),
    adminSupabase.from("warga").select("rt, no_kk")
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden min-h-[300px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517737279169-2616f7fb1e59?w=1600&q=80"
            alt="Wilayah RT Background"
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
            <span className="text-white">Wilayah RT</span>
          </div>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
              Daftar Rukun Tetangga (RT)
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Pilih RT untuk melihat profil, laporan kas khusus RT, dan demografi warganya secara detail.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rtList.map((no_rt) => {
            const profil = profilRt?.find(p => p.no_rt === no_rt);
            const wargaRt = wargaList?.filter(w => w.rt === no_rt) || [];
            const noKkSet = new Set(wargaRt.map(w => w.no_kk).filter(Boolean));
            
            return (
              <Link
                key={no_rt}
                href={`/rt/${no_rt}`}
                className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-primary/30">
                    {no_rt}
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-1" style={{ fontFamily: "var(--font-bitter)" }}>
                    RT {no_rt}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mb-4">{profil?.ketua_nama ? `Ketua: ${profil.ketua_nama}` : 'Ketua belum diset'}</p>
                  
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-4 mt-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{wargaRt.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Home className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-bold">{noKkSet.size} KK</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
