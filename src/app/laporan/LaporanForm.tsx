"use client";

import { useState } from "react";
import { submitLaporan } from "./actions";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function LaporanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitLaporan(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setFileName("");
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-emerald-200/50 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-bitter)" }}>Laporan Terkirim!</h3>
        <p className="text-muted-foreground mb-6">Terima kasih atas laporan Anda. Pengurus RW akan segera menindaklanjutinya.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Kirim Laporan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
      <h3 className="text-xl font-bold text-foreground mb-2 border-b border-border/60 pb-4" style={{ fontFamily: "var(--font-bitter)" }}>
        Formulir Laporan Baru
      </h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Nama Pelapor (Opsional)</label>
        <input 
          name="nama_pelapor" 
          type="text" 
          placeholder="Boleh dikosongkan (Anonim)" 
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" 
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Kategori Laporan <span className="text-red-500">*</span></label>
        <select 
          name="kategori" 
          required 
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium appearance-none"
        >
          <option value="">-- Pilih Kategori --</option>
          <option value="Jalan Rusak">Jalan Rusak</option>
          <option value="Lampu Jalan Mati">Lampu Jalan Mati</option>
          <option value="Fasilitas Umum Rusak">Fasilitas Umum Rusak</option>
          <option value="Tumpukan Sampah">Tumpukan Sampah</option>
          <option value="Saluran Air/Banjir">Saluran Air/Banjir</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Lokasi (Opsional)</label>
        <input 
          name="lokasi" 
          type="text" 
          placeholder="Contoh: Depan pos ronda RT 02" 
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" 
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Deskripsi Detail <span className="text-red-500">*</span></label>
        <textarea 
          name="deskripsi" 
          required 
          rows={4}
          placeholder="Jelaskan secara detail kerusakan atau masalah yang terjadi..." 
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none" 
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Unggah Foto (Opsional)</label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-2xl cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              {fileName ? <span className="text-primary font-bold">{fileName}</span> : "Klik untuk upload foto pendukung"}
            </p>
          </div>
          <input 
            type="file" 
            name="foto" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground font-bold px-6 py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 mt-4"
      >
        {isSubmitting ? "Mengirim Laporan..." : "Kirim Laporan"}
      </button>
    </form>
  );
}
