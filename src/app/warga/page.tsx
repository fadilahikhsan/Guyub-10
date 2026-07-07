import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Database, Users, Activity, Lock, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ClientWargaTable from "./ClientWargaTable";

export const revalidate = 0;

export default async function WargaPage({ searchParams }: { searchParams: Promise<{ access_key?: string }> }) {
  const resolvedParams = await searchParams;
  const accessKey = resolvedParams.access_key;
  const supabase = await createClient();

  const { data: profilRw } = await supabase.from('profil_rw').select('password_warga').limit(1).single();

  // Use environment variable as fallback if DB password is empty
  const expectedKey = profilRw?.password_warga || process.env.WARGA_ACCESS_PASSWORD || "RW10PINTAR";
  const isAuthenticated = accessKey === expectedKey; 

  const { count: countTotalWarga } = await supabase.from('warga').select('*', { count: 'exact', head: true });
  const { count: countLaki } = await supabase.from('warga').select('*', { count: 'exact', head: true }).eq('jenis_kelamin', 'L');
  const { count: countPerempuan } = await supabase.from('warga').select('*', { count: 'exact', head: true }).eq('jenis_kelamin', 'P');
  
  // Hitung KK sederhana (asumsi 1 KK = 3-4 warga) -> Idealnya group by no_kk
  const jumlahWarga = countTotalWarga || 0;
  const estimasiKK = Math.floor(jumlahWarga / 3);

  let wargaList: any[] = [];
  if (isAuthenticated) {
    // Ambil data dasar saja (level 2)
    const { data } = await supabase
      .from('warga')
      .select('id, nama_lengkap, rt, jenis_kelamin')
      .order('rt', { ascending: true })
      .order('nama_lengkap', { ascending: true });
    wargaList = data || [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden min-h-[280px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Database Warga Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-[rgba(13,33,25,0.93)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Database Warga</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
            Database Kependudukan
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto mb-8">
            Ringkasan data statistik warga RW 10 Desa Cicadas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs font-bold text-white/80 uppercase mb-1">Total Warga</p>
              <p className="text-3xl font-black text-white">{jumlahWarga}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs font-bold text-white/80 uppercase mb-1">Estimasi KK</p>
              <p className="text-3xl font-black text-white">{estimasiKK}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs font-bold text-white/80 uppercase mb-1">Laki-laki</p>
              <p className="text-3xl font-black text-white">{countLaki || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs font-bold text-white/80 uppercase mb-1">Perempuan</p>
              <p className="text-3xl font-black text-white">{countPerempuan || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-16 relative z-20">
        {!isAuthenticated ? (
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl text-center max-w-2xl mx-auto -mt-24">
            <Lock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-foreground mb-2">Akses Terbatas</h2>
            <p className="text-muted-foreground font-medium mb-8">
              Rincian nama warga per RT hanya dapat diakses oleh warga RW 10 menggunakan kata sandi khusus dari pengurus.
            </p>
            <form action="/warga" method="get" className="flex flex-col sm:flex-row gap-3 justify-center">
              <input 
                type="password" 
                name="access_key" 
                placeholder="Masukkan kata sandi akses..." 
                className="px-6 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center sm:text-left text-foreground"
                required
              />
              <button type="submit" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Buka Akses
              </button>
            </form>
            <div className="mt-8 p-4 bg-highlight/10 rounded-xl border border-highlight/20 flex items-start text-left gap-3">
              <AlertTriangle className="w-5 h-5 text-highlight shrink-0 mt-0.5" />
              <p className="text-xs text-foreground font-medium leading-relaxed">
                Data yang ditampilkan pada halaman ini sangat terbatas (hanya nama, L/P, dan RT) demi menjaga privasi warga. Data lengkap (NIK/KK) hanya dapat diakses oleh Admin RW melalui Dashboard.
              </p>
            </div>
          </div>
        ) : (
          <ClientWargaTable wargaList={wargaList} />
        )}
      </div>
    </div>
  );
}
