import Link from "next/link";
import { ChevronRight, Calendar, ArrowLeft, Eye, User, MessageSquare, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ShareButtons } from "./ShareButtons";
import { KomentarForm } from "./KomentarForm";

export const revalidate = 0;

export default async function InformasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  // Ambil data artikel
  const { data: item } = await supabase
    .from("pengumuman")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  // Increment views (fire and forget, pakai admin client bypass RLS)
  adminSupabase
    .from("pengumuman")
    .update({ views: (item.views ?? 0) + 1 })
    .eq("id", id)
    .then(() => {});

  // Ambil komentar yang sudah disetujui
  const { data: komentarList } = await supabase
    .from("komentar_pengumuman")
    .select("id, nama, isi, created_at")
    .eq("pengumuman_id", id)
    .eq("status", "disetujui")
    .order("created_at", { ascending: true });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isPenting =
    item.kategori?.toLowerCase() === "penting" ||
    item.kategori?.toLowerCase() === "darurat";
  const bgBadge = isPenting
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-primary/10 text-primary border-primary/20";

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://guyub10.vercel.app"}/informasi/${id}`;

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-20 bg-background">
      {/* Breadcrumb */}
      <section className="container mx-auto px-4 max-w-4xl mb-6">
        <div className="flex items-center text-sm font-bold text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/informasi" className="hover:text-primary transition-colors">
            Berita Warga
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground truncate max-w-[200px]">{item.judul}</span>
        </div>

        <Link
          href="/informasi"
          className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
        </Link>
      </section>

      {/* Artikel */}
      <section className="container mx-auto px-4 max-w-4xl">
        <article className="bg-card border border-border/60 rounded-3xl p-6 md:p-12 shadow-sm">
          {/* Meta atas */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`${bgBadge} border font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider`}
            >
              {item.kategori}
            </span>
            <div className="flex items-center text-muted-foreground font-medium text-sm gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(item.created_at)}
            </div>
            <div className="flex items-center text-muted-foreground font-medium text-sm gap-1.5">
              <Clock className="w-4 h-4" />
              {formatTime(item.created_at)}
            </div>
            <div className="flex items-center text-muted-foreground font-medium text-sm gap-1.5">
              <Eye className="w-4 h-4" />
              {(item.views ?? 0) + 1} kali dibaca
            </div>
            <div className="flex items-center text-muted-foreground font-medium text-sm gap-1.5">
              <MessageSquare className="w-4 h-4" />
              {komentarList?.length ?? 0} komentar
            </div>
          </div>

          {/* Judul */}
          <h1
            className="text-3xl md:text-4xl font-black mb-3 leading-tight text-foreground"
            style={{ fontFamily: "var(--font-bitter)" }}
          >
            {item.judul}
          </h1>

          {/* Penulis */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-8">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span>Oleh: <strong className="text-foreground">{item.penyelenggara ?? "Pengurus RW 10"}</strong></span>
          </div>

          {/* Foto */}
          {item.foto_url && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-border/50 shadow-md">
              <img
                src={item.foto_url}
                alt={item.judul}
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          )}

          {/* Konten */}
          <div className="prose prose-zinc max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:font-medium prose-headings:font-black prose-headings:text-foreground">
            {item.konten.split("\n").map((paragraph: string, index: number) =>
              paragraph.trim() ? (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            )}
          </div>

          {/* Share Buttons */}
          <ShareButtons title={item.judul} url={pageUrl} />

          {/* ── KOMENTAR ── */}
          <div className="mt-10 pt-8 border-t border-border">
            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Komentar ({komentarList?.length ?? 0})
            </h2>

            {/* Daftar komentar */}
            {komentarList && komentarList.length > 0 ? (
              <div className="space-y-4 mb-8">
                {komentarList.map((k) => (
                  <div
                    key={k.id}
                    className="bg-muted/40 border border-border/50 rounded-2xl px-5 py-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-black uppercase">
                        {k.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{k.nama}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(k.created_at)} · {formatTime(k.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed pl-10">
                      {k.isi}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-2xl mb-8">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-medium text-sm">Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            )}
          </div>

          {/* Form Komentar */}
          <KomentarForm pengumumanId={id} />
        </article>
      </section>
    </div>
  );
}
