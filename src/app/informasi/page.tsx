import Link from "next/link";
import { ChevronRight, Megaphone, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function InformasiPage() {
  const supabase = await createClient();
  const { data: pengumumanList } = await supabase
    .from("pengumuman")
    .select("*")
    .order("created_at", { ascending: false });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-20 bg-background">
      <section className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="flex items-center text-sm font-bold text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Berita Warga</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>
          <Megaphone className="mr-4 w-12 h-12 text-primary" />
          Berita Warga
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Berita, artikel blog, dan kabar terbaru seputar kegiatan RW 10.
        </p>
      </section>

      <section className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col gap-6">
          
          {pengumumanList && pengumumanList.length > 0 ? (
            pengumumanList.map((item) => {
              const isPenting = item.kategori.toLowerCase() === "penting" || item.kategori.toLowerCase() === "darurat";
              const bgBadge = isPenting ? "bg-red-100 text-red-700 border-red-200" : "bg-primary/10 text-primary border-primary/20";
              const bgGlow = isPenting ? "bg-red-500/10 group-hover:bg-red-500/20" : "bg-primary/10 group-hover:bg-primary/20";
              
              return (
                <article key={item.id} className="bg-card border border-border/60 card-hover rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] -z-10 transition-colors ${bgGlow}`}></div>
                  
                  {item.foto_url && (
                    <div className="w-full md:w-1/3 shrink-0">
                      <img src={item.foto_url} alt={item.judul} className="w-full h-48 md:h-full object-cover rounded-2xl shadow-sm border border-border/50 group-hover:shadow-md transition-all" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`${bgBadge} border font-bold px-3 py-1 rounded-full text-xs uppercase`}>
                        {item.kategori}
                      </span>
                      <div className="flex items-center text-muted-foreground font-medium text-xs">
                        <Calendar className="w-4 h-4 mr-2" /> {formatDate(item.created_at)}
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-bitter)" }}>
                      {item.judul}
                    </h2>
                    <p className="text-muted-foreground font-medium mb-6 line-clamp-3">
                      {item.konten}
                    </p>
                    <Link href={`/informasi/${item.id}`} className="text-primary font-bold flex items-center hover:underline text-sm uppercase tracking-wider w-fit">
                      Baca selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground font-medium">
              Belum ada berita warga saat ini.
            </div>
          )}

        </div>
        
        {pengumumanList && pengumumanList.length > 0 && (
          <div className="mt-12 text-center">
            <button className="bg-muted text-muted-foreground hover:bg-secondary hover:text-white font-bold px-8 py-4 rounded-2xl transition-all">
              Muat Berita Terdahulu
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
