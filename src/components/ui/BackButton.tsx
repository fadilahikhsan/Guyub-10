"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jangan tampilkan di Beranda (/) atau halaman Admin (/admin...) karena admin punya layout sendiri
  if (!mounted || pathname === "/" || pathname.startsWith("/admin")) return null;

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[60] flex items-center gap-2 px-4 py-3 bg-white text-primary rounded-2xl shadow-xl shadow-black/10 border border-slate-100 hover:bg-slate-50 hover:-translate-x-1 hover:shadow-2xl transition-all duration-300 group"
      aria-label="Kembali ke halaman sebelumnya"
    >
      <div className="bg-primary/10 p-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </div>
      <span className="font-bold text-sm hidden md:block">Kembali</span>
    </button>
  );
}
