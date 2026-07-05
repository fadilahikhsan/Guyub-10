"use client";

import { useState } from "react";
import { registerUmkm } from "./actions";
import { Loader2 } from "lucide-react";

export default function UmkmForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUmkm(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: "UMKM berhasil didaftarkan. Menunggu verifikasi dari pengurus." });
      (e.target as HTMLFormElement).reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-muted/50 p-5 rounded-2xl border border-border">
      {message && (
        <div className={`p-3 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-muted-foreground mb-1.5">Nama Usaha</label>
        <input 
          type="text" 
          name="nama_usaha"
          required
          placeholder="Cth: Nasi Uduk Bu Tejo"
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground mb-1.5">Kategori</label>
        <select 
          name="kategori"
          required
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Pilih Kategori</option>
          <option value="Makanan & Minuman">Makanan & Minuman</option>
          <option value="Jasa & Perbaikan">Jasa & Perbaikan</option>
          <option value="Toko Kelontong">Toko Kelontong</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground mb-1.5">Deskripsi Singkat</label>
        <textarea 
          name="deskripsi"
          required
          rows={3}
          placeholder="Jelaskan produk/jasa yang dijual..."
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground mb-1.5">Nomor WhatsApp</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+62</span>
          <input 
            type="text" 
            name="nomor_wa"
            required
            pattern="[0-9]+"
            placeholder="81234567890"
            className="w-full pl-[3.25rem] pr-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        Daftarkan Usaha
      </button>
    </form>
  );
}
