"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { submitUmkm } from "../actions";

export default function UMKMRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const result = await submitUmkm(formData);

      if (result.error) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 bg-background">
        <div className="bg-white p-12 rounded-2xl border border-border max-w-lg w-full text-center shadow-lg">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-bitter)" }}>Pendaftaran Berhasil!</h1>
          <p className="text-muted-foreground font-medium mb-8">
            Data usaha Anda telah berhasil dikirim dan sedang <strong>menunggu persetujuan (Review)</strong> oleh Admin RW. 
            <br/><br/>
            Usaha Anda akan tampil di halaman UMKM setelah disetujui.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/umkm">
              <button className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all w-full">
                Kembali ke Halaman UMKM
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[240px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="Daftar UMKM Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-[rgba(13,33,25,0.93)]" />
        <div className="container mx-auto px-4 max-w-3xl py-16 relative z-10">
          <div className="flex items-center text-sm font-bold text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/umkm" className="hover:text-white transition-colors">UMKM Warga</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Daftar Usaha</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-bitter)" }}>
              Daftarkan Usaha
            </h1>
          </div>
          <p className="text-white/90 text-lg font-medium">
            Isi formulir di bawah ini untuk mempromosikan usaha, warung, atau jasa Anda ke seluruh warga RW 10 secara gratis.
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="container mx-auto px-4 max-w-3xl py-12">
        <div className="bg-white rounded-2xl p-6 md:p-10 border border-border shadow-md">
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 text-sm font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Nama Pemilik *</label>
                <input 
                  type="text" 
                  name="nama_pemilik"
                  required
                  placeholder="Contoh: Bpk. Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Nama Usaha / Toko *</label>
                <input 
                  type="text" 
                  name="nama_usaha"
                  required
                  placeholder="Contoh: Warung Nasi Uduk Mpok Ipeh"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Kategori Usaha *</label>
                <select 
                  name="kategori"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="Kuliner (Makanan/Minuman)">Kuliner (Makanan/Minuman)</option>
                  <option value="Jasa & Perbaikan">Jasa & Perbaikan</option>
                  <option value="Toko Kelontong / Retail">Toko Kelontong / Retail</option>
                  <option value="Fashion & Kerajinan">Fashion & Kerajinan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Nomor WhatsApp *</label>
                <input 
                  type="text" 
                  name="nomor_wa"
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Alamat Lengkap / Patokan *</label>
                <input 
                  type="text" 
                  name="alamat"
                  required
                  placeholder="Contoh: Blok A No. 12 (Samping Masjid)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">Jam Operasional (Opsional)</label>
                <input 
                  type="text" 
                  name="jam_buka"
                  placeholder="Contoh: Setiap Hari, 08:00 - 20:00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Upload Foto Usaha / Logo (Opsional)</label>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setLogoFile(file);
                }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {logoFile && (
                <p className="text-xs text-green-600 mt-1 font-medium">✓ {logoFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Deskripsi Lengkap & Daftar Menu *</label>
              <textarea 
                name="deskripsi"
                required
                rows={6}
                placeholder="Ceritakan tentang usaha Anda. Anda juga bisa menuliskan daftar menu, harga barang, atau layanan jasa yang ditawarkan..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium resize-y text-foreground"
              ></textarea>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground font-black text-lg px-8 py-4 rounded-xl shadow-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                ) : null}
                Kirim Pendaftaran UMKM
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}
