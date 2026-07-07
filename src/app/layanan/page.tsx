"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FileText, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { submitSurat } from "./actions";

type FormDataState = {
  jenis: string;
  nik: string;
  lampiran: File | null;
  tujuan: string;
  keperluan: string;
};

export default function LayananSuratPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nomorTiket, setNomorTiket] = useState("");
  const [formData, setFormData] = useState<FormDataState>({
    jenis: "",
    nik: "",
    lampiran: null,
    tujuan: "",
    keperluan: "",
  });

  const updateField = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (step === 1 && !formData.jenis) {
      setErrorMessage("Pilih jenis surat terlebih dahulu.");
      return;
    }
    if (step === 2) {
      if (!formData.nik || formData.nik.length !== 16) {
        setErrorMessage("NIK harus 16 digit angka.");
        return;
      }
      if (!formData.lampiran) {
        setErrorMessage("Upload dokumen KTP/KK terlebih dahulu.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.tujuan) {
        setErrorMessage("Pilih tujuan pengajuan.");
        return;
      }
      if (!formData.keperluan) {
        setErrorMessage("Isi keperluan surat.");
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Submit
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    const fd = new FormData();
    fd.append("jenis", formData.jenis);
    fd.append("nik", formData.nik);
    if (formData.lampiran) fd.append("lampiran", formData.lampiran);
    fd.append("tujuan", formData.tujuan);
    fd.append("keperluan", formData.keperluan);

    const result = await submitSurat(fd);

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
    } else {
      setNomorTiket(result.nomorTiket || "TKT-0000");
      setIsSuccess(true);
    }
  };

  const jenisSurat = [
    "Pengantar KTP / KK",
    "Surat Keterangan Domisili",
    "Surat Keterangan Usaha (SKU)",
    "Surat Keterangan Tidak Mampu (SKTM)",
    "Surat Pengantar Nikah (N1-N4)",
    "Surat Keterangan Kematian",
    "Surat Keterangan Kelahiran",
    "Surat Izin Keramaian",
    "Surat Keterangan Pindah",
    "Surat Keterangan Belum Menikah"
  ];

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 bg-background">
        <div className="bg-white p-12 rounded-2xl border border-border max-w-lg w-full text-center shadow-lg">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-bitter)" }}>Pengajuan Berhasil!</h1>
          <p className="text-lg text-muted-foreground font-medium mb-6">
            Permintaan surat pengantar Anda telah masuk ke sistem.
          </p>
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-8 inline-block">
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Nomor Tiket Anda</p>
            <p className="text-2xl font-black font-mono tracking-wider text-primary">{nomorTiket}</p>
          </div>
          <p className="text-sm text-zinc-500 mb-8">Simpan nomor tiket ini untuk mengecek status surat Anda.</p>
          <div className="flex flex-col gap-3">
            <Link href="/layanan/cek">
              <button className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all w-full">
                Cek Status Surat Sekarang
              </button>
            </Link>
            <Link href="/">
              <button className="bg-muted text-foreground font-bold px-8 py-4 rounded-xl hover:bg-muted/80 transition-all w-full border border-border">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Wallpaper */}
      <section className="relative overflow-hidden min-h-[240px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80"
            alt="Layanan Surat Background"
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
            <span className="text-white">Layanan Surat</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-bitter)" }}>
              Pengajuan Surat
            </h1>
          </div>
          <p className="text-white/90 text-lg font-medium">
            Ajukan surat pengantar secara online, mudah dan cepat.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-3xl py-12">
        <div className="bg-white rounded-2xl p-6 md:p-10 border border-border shadow-md">
          
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-bold ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Jenis</span>
              <span className={`text-xs font-bold ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Identitas</span>
              <span className={`text-xs font-bold ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Tujuan</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 text-sm font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-8">

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-bitter)" }}>Pilih Jenis Surat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jenisSurat.map(j => (
                    <label key={j} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="jenis" 
                        value={j} 
                        className="peer sr-only" 
                        checked={formData.jenis === j}
                        onChange={() => updateField("jenis", j)}
                      />
                      <div className="bg-muted border-2 border-border p-3 rounded-xl peer-checked:border-primary peer-checked:bg-primary/10 transition-all text-center font-bold text-sm text-foreground">
                        {j}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-bitter)" }}>Verifikasi Identitas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">Nomor Induk Kependudukan (NIK) *</label>
                    <input 
                      type="text" 
                      value={formData.nik}
                      onChange={(e) => updateField("nik", e.target.value.replace(/\D/g, "").slice(0, 16))}
                      placeholder="16 Digit Angka NIK"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">Unggah Dokumen (KTP/KK) *</label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateField("lampiran", file);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {formData.lampiran && (
                      <p className="text-xs text-green-600 mt-1 font-medium">✓ {formData.lampiran.name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-bitter)" }}>Tujuan & Keperluan</h3>
                
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Tujuan Pengajuan *</label>
                  <select 
                    value={formData.tujuan}
                    onChange={(e) => updateField("tujuan", e.target.value)}
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground"
                  >
                    <option value="">Pilih Tujuan...</option>
                    <option value="RW 10">Pengurus RW 10</option>
                    <option value="RT 01">Pengurus RT 01</option>
                    <option value="RT 02">Pengurus RT 02</option>
                    <option value="RT 03">Pengurus RT 03</option>
                    <option value="RT 04">Pengurus RT 04</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Mengapa Anda membutuhkan surat ini? *</label>
                  <textarea 
                    value={formData.keperluan}
                    onChange={(e) => updateField("keperluan", e.target.value)}
                    rows={4}
                    placeholder="Jelaskan secara singkat keperluan Anda..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium resize-none text-foreground"
                  ></textarea>
                </div>

                {/* Ringkasan */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-xs font-bold text-primary uppercase mb-2">Ringkasan Pengajuan</p>
                  <div className="text-sm text-foreground space-y-1">
                    <p><span className="font-bold">Jenis:</span> {formData.jenis}</p>
                    <p><span className="font-bold">NIK:</span> {formData.nik}</p>
                    {formData.lampiran && <p><span className="font-bold">File:</span> {formData.lampiran.name}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gray-200 flex justify-between">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="flex items-center px-6 py-3 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
                </button>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                ) : null}
                {step === 3 ? "Kirim Pengajuan" : "Lanjut"}
                {step !== 3 && !isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}