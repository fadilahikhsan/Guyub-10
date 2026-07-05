"use client";

import { useState } from "react";
import { Megaphone, CheckCircle2 } from "lucide-react";
import { submitAspirasi } from "./actions";

export default function AspirasiForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitAspirasi(formData);

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
      setIsSubmitting(false);
      // Reset after 3s
      setTimeout(() => {
        setIsSuccess(false);
        (e.target as HTMLFormElement).reset();
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-black text-foreground mb-2">Terkirim!</h3>
        <p className="text-muted-foreground">Terima kasih atas masukan Anda. Aspirasi Anda telah diterima oleh pengurus.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200">
          {errorMessage}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Kategori *</label>
        <select name="kategori" required className="w-full p-3.5 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
          <option value="">Pilih Kategori...</option>
          <option value="Lingkungan & Kebersihan">Lingkungan & Kebersihan</option>
          <option value="Keamanan">Keamanan (Siskamling/Portal)</option>
          <option value="Infrastruktur">Infrastruktur (Jalan/Saluran)</option>
          <option value="Layanan Administrasi">Layanan Administrasi (RT/RW)</option>
          <option value="Kegiatan Sosial">Kegiatan Sosial/Warga</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Nama Anda (Opsional)</label>
        <input type="text" name="nama" placeholder="Boleh dikosongkan (Anonim)" className="w-full p-3.5 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Pesan Aspirasi *</label>
        <textarea name="pesan" required rows={4} placeholder="Tuliskan masukan atau keluhan Anda di sini..." className="w-full p-3.5 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"></textarea>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Megaphone className="w-5 h-5"/>}
        Kirim Aspirasi Sekarang
      </button>
    </form>
  );
}
