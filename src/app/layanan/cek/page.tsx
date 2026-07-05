import Link from "next/link";
import { ChevronRight, SearchCheck } from "lucide-react";
import CekStatusForm from "./CekStatusForm";

export const metadata = {
  title: "Cek Status Surat - Portal Guyub",
  description: "Cek status pengajuan surat pengantar secara mandiri menggunakan nomor tiket.",
};

export default function CekStatusPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-highlight geo-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/layanan" className="hover:text-white transition-colors">Layanan</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Cek Status</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <SearchCheck className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
            Lacak Pengajuan Surat
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto mb-8">
            Masukkan Nomor Tiket yang Anda dapatkan saat mengajukan surat untuk melihat status proses saat ini.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl py-12 md:py-20 -mt-16 relative z-20">
        <CekStatusForm />
      </section>
    </div>
  );
}
