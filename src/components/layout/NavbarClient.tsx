"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";
import {
  MountainIcon,
  Menu,
  X,
  Search,
  Bell,
  Globe,
  AtSign,
  Share2,
  LayoutDashboard,
  LogIn,
  ChevronDown,
} from "lucide-react";

interface NavbarClientProps {
  user: User | null;
  role?: string;
  announcements?: { id: string; judul: string }[];
}

const mainNavLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil RW" },
  { href: "/informasi", label: "Berita Warga" },
  { href: "/kegiatan", label: "Agenda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/umkm", label: "UMKM" },
  { href: "/kas", label: "Laporan Kas" },
];

const dropdownLinks = [
  { href: "/rt", label: "Wilayah RT (Dashboard)" },
  { href: "/laporan", label: "Lapor Infrastruktur" },
  { href: "/fasilitas", label: "Fasilitas" },
  { href: "/galeri", label: "Galeri Warga" },
  { href: "/aspirasi", label: "Aspirasi" },
  { href: "/lembaga", label: "Lembaga RW" },
];

export default function NavbarClient({ user, role = "user", announcements = [] }: NavbarClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => setMobileOpen(false), 0);
  }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";
  const isHomeTop = isHome && !scrolled;

  return (
    <>
      <header
        className={`w-full z-50 transition-all duration-300 ${
          isHomeTop
            ? "absolute top-0 left-0 right-0 bg-transparent"
            : scrolled
            ? "fixed top-0 left-0 right-0 shadow-xl bg-white/95 backdrop-blur-md"
            : "relative bg-white"
        }`}
      >
        {/* ── Top Utility Bar ── */}
        <div className={`${isHomeTop ? "bg-black/20 border-b border-white/10" : "bg-secondary"} text-white py-1.5 hidden md:block transition-colors`}>
          <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center text-xs">
            <div className={`flex items-center gap-3 ${isHomeTop ? "text-white/80" : "text-slate-400"}`}>
              <Bell className="w-3 h-3 text-highlight animate-pulse-soft" />
              <span className="font-medium">
                Selamat Datang di Portal Resmi RW 10 Desa Cicadas
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <div className={`flex items-center gap-3 border-r pr-4 ${isHomeTop ? "border-white/20" : "border-slate-700"}`}>
                {[
                  { icon: Globe, label: "Website", hover: "hover:text-blue-400" },
                  { icon: AtSign, label: "Email", hover: "hover:text-pink-400" },
                  { icon: Share2, label: "Bagikan", hover: "hover:text-highlight" },
                ].map(({ icon: Icon, label, hover }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`transition-colors ${isHomeTop ? "text-white/70 hover:text-white" : "text-slate-500 " + hover}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
              {user ? (
                <>
                  <Link
                    href={role === "admin" ? "/admin" : "/warga"}
                    className="font-semibold text-highlight hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    {role === "admin" ? "Admin Panel" : "Dasbor Saya"}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="font-semibold text-white hover:text-red-300 transition-colors flex items-center gap-1 ml-2"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="font-semibold text-highlight hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Announcement Banner (Marquee) ── */}
        {announcements.length > 0 && (
          <div className={`${isHomeTop ? "bg-black/20 text-white border-b border-white/10" : "bg-gradient-to-r from-accent to-orange-600 text-white border-b border-orange-600/20"} overflow-hidden py-1.5 hidden md:block transition-colors`}>
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center">
                <div className={`${isHomeTop ? "bg-white/20 text-white" : "bg-white/90 text-slate-900"} px-3 py-0.5 rounded text-[11px] font-black whitespace-nowrap mr-4 shrink-0 flex items-center gap-1.5 shadow-sm uppercase tracking-wider transition-colors`}>
                  <Bell className={`w-3 h-3 animate-pulse ${isHomeTop ? "text-highlight" : "text-accent"}`} />
                  Info Warga
                </div>
                <div className="overflow-hidden w-full relative">
                  <div className="whitespace-nowrap inline-block animate-marquee hover:[animation-play-state:paused] group cursor-default">
                    {announcements.map((ann, i) => (
                      <span key={ann.id} className="mx-6 text-xs font-semibold">
                        <span className="text-white/70 mx-2 text-[10px]">●</span>
                        {ann.judul}
                      </span>
                    ))}
                    {/* Duplicate for seamless marquee if few items */}
                    {announcements.length < 5 && announcements.map((ann, i) => (
                      <span key={`${ann.id}-dup`} className="mx-6 text-xs font-semibold">
                        <span className="text-white/70 mx-2 text-[10px]">●</span>
                        {ann.judul}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Header ── */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`${isHomeTop ? "bg-white/20 backdrop-blur" : "bg-primary"} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-3 ${
                  scrolled ? "w-9 h-9" : "w-12 h-12"
                } ${!isHomeTop && "group-hover:bg-primary/90"}`}
              >
                <MountainIcon
                  className={`text-white transition-all duration-300 ${
                    scrolled ? "h-5 w-5" : "h-7 w-7"
                  }`}
                />
              </div>
              <div>
                <span
                  className={`block font-black tracking-tight transition-all duration-300 leading-none ${
                    scrolled ? "text-2xl" : "text-3xl"
                  } ${isHomeTop ? "text-white" : "text-foreground"}`}
                  style={{ fontFamily: "var(--font-bitter)" }}
                >
                  Guyub<span className={isHomeTop ? "text-highlight" : "text-primary"}>.</span>
                </span>
                {!scrolled && (
                  <span className={`block text-xs font-semibold uppercase tracking-widest mt-0.5 ${isHomeTop ? "text-white/80" : "text-muted-foreground"}`}>
                    Portal Informasi RW 10
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Search + DARURAT */}
            <div className="hidden lg:flex items-center gap-3">
              <div
                className={`relative transition-all duration-300 ${
                  searchOpen ? "w-72" : "w-56"
                }`}
              >
                <input
                  type="text"
                  placeholder="Cari informasi warga..."
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                  className={`w-full pl-4 pr-10 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                    isHomeTop 
                      ? "border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20" 
                      : "border-border bg-muted/60 text-foreground focus:border-primary focus:bg-white placeholder:text-muted-foreground/60"
                  }`}
                />
                <Search className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${isHomeTop ? "text-white/60" : "text-muted-foreground"}`} />
              </div>

              <Link
                href="/darurat"
                className="flex items-center gap-1.5 bg-destructive hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-200/60 active:scale-95"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                DARURAT
              </Link>
            </div>

            {/* Mobile Burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 border rounded-xl transition-colors ${
                isHomeTop 
                  ? "text-white border-white/20 bg-white/10 hover:bg-white/20"
                  : "text-foreground border-border bg-muted/60 hover:bg-muted"
              }`}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Primary Navigation Bar ── */}
        <nav className={`hidden md:block transition-colors ${isHomeTop ? "bg-black/10 border-t border-white/10 backdrop-blur-sm" : "bg-primary"}`} aria-label="Menu Utama">
          <div className="container mx-auto px-4 max-w-6xl">
            <ul className="flex items-center text-sm font-semibold" role="list">
              {mainNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`block px-4 py-3.5 transition-all duration-200 relative ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-highlight rounded-t-sm" />
                      )}
                    </Link>
                  </li>
                );
              })}
              
              {/* Dropdown Lainnya */}
              <li className="relative group">
                <button className="flex items-center gap-1 px-4 py-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200">
                  Lainnya <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border-t-2 border-primary rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100 overflow-hidden">
                  <ul className="py-2 text-foreground">
                    {dropdownLinks.map(link => {
                      const isActive = pathname.startsWith(link.href);
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`block px-5 py-2.5 text-sm transition-colors ${
                              isActive ? "bg-primary/5 text-primary font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-primary font-medium"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>

              <li className="ml-auto">
                <Link
                  href="/darurat"
                  className="flex items-center gap-1.5 mx-2 my-2 px-4 py-2 bg-destructive hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  DARURAT
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Spacer agar konten tidak tertutup saat navbar fixed - ONLY IF NOT HOME TOP */}
      {(!isHomeTop && scrolled) && (
        <div
          className="w-full"
          style={{ height: "calc(4rem + 2.75rem + 3rem)" }}
          aria-hidden="true"
        />
      )}
      {(!isHomeTop && !scrolled) && (
        <div
          className="w-full md:hidden"
          style={{ height: "0" }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-card shadow-2xl transition-transform duration-300 flex flex-col ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-secondary to-primary flex-shrink-0">
            <span
              className="text-2xl font-black text-white"
              style={{ fontFamily: "var(--font-bitter)" }}
            >
              Guyub<span className="text-highlight">.</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {[...mainNavLinks, ...dropdownLinks].map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-highlight rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Auth + Darurat */}
            <div className="pt-3 border-t border-border space-y-2">
              <Link
                href="/darurat"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Lapor Darurat
              </Link>
              {user ? (
                <>
                  <Link
                    href={role === "admin" ? "/admin" : "/warga"}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {role === "admin" ? "Admin Panel" : "Dasbor Saya"}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200 transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-primary text-sm font-bold border-2 border-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border bg-muted/30 flex-shrink-0">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} RW 10 Desa Cicadas
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
