"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2, CheckCircle, User, Mail } from "lucide-react";
import { submitKomentar } from "../actions";

export function KomentarForm({ pengumumanId }: { pengumumanId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const result = await submitKomentar(pengumumanId, formData);

    if (result.success) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Gagal mengirim komentar.");
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary/10 p-2 rounded-xl">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-black text-foreground">Kirim Komentar</h2>
      </div>

      {/* Info moderasi */}
      <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r-xl mb-6">
        <p className="text-sm text-amber-800 font-medium">
          💬 Komentar baru akan terbit setelah disetujui oleh Admin.
        </p>
      </div>

      {/* Success state */}
      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl mb-6 font-semibold">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Komentar kamu berhasil dikirim! Menunggu persetujuan admin.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-destructive px-5 py-3 rounded-2xl mb-6 text-sm font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Isi Komentar */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground" htmlFor="isi">
            Komentar <span className="text-red-500">*</span>
          </label>
          <textarea
            id="isi"
            name="isi"
            required
            rows={4}
            placeholder="Tulis komentarmu di sini..."
            className="w-full rounded-xl border-2 border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground" htmlFor="nama">
              Nama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="nama"
                name="nama"
                type="text"
                required
                placeholder="Nama kamu"
                className="w-full h-11 rounded-xl border-2 border-border bg-muted/40 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Email (opsional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground" htmlFor="email">
              Email <span className="text-muted-foreground font-normal text-xs">(opsional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@kamu.com"
                className="w-full h-11 rounded-xl border-2 border-border bg-muted/40 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:pointer-events-none disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isLoading ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>
    </div>
  );
}
