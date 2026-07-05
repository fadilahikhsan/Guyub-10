"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MountainIcon,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMessage("");
    const result = await login(formData);
    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-muted p-4">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-5 group">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-colors">
              <MountainIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <span
              className="text-3xl font-black tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-bitter)" }}
            >
              Guyub<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Admin Badge */}
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Panel Admin</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Login Administrator
          </h1>
          <p className="text-muted-foreground mt-1.5 text-center text-sm font-medium max-w-xs">
            Halaman ini khusus untuk pengurus RW 10. Warga tidak perlu login.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-7 shadow-xl">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-destructive text-sm font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold leading-none text-foreground" htmlFor="email">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@admin.com"
                  required
                  autoComplete="email"
                  className="flex h-12 w-full rounded-xl border-2 border-border bg-muted/40 pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold leading-none text-foreground" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                  className="flex h-12 w-full rounded-xl border-2 border-border bg-muted/40 pl-11 pr-11 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:pointer-events-none disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Panel Admin →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
          © {new Date().getFullYear()} Portal Digital RW 10 Desa Cicadas
        </p>
      </div>
    </div>
  );
}
