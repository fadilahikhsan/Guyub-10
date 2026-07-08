import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Globe,
  AtSign,
  Share2,
  Link2,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = [
  { href: "/profil", label: "Profil Lingkungan" },
  { href: "/informasi", label: "Transparansi Kas & Berita" },
  { href: "/layanan", label: "Layanan Surat Pengantar" },
  { href: "/umkm", label: "Direktori UMKM Warga" },
  { href: "/darurat", label: "Kontak Darurat" },
];

const socialLinks = [
  { icon: Globe, label: "Website", href: "#", hoverColor: "hover:bg-blue-600" },
  { icon: AtSign, label: "Email / IG", href: "#", hoverColor: "hover:bg-pink-500" },
  { icon: Share2, label: "Bagikan", href: "#", hoverColor: "hover:bg-slate-600" },
  { icon: Link2, label: "Tautan", href: "#", hoverColor: "hover:bg-red-600" },
];

import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = await createClient();
  const { data: profil } = await supabase.from("profil_rw").select("wa_rw").limit(1).single();
  const noWa = profil?.wa_rw || "+6281234567890";

  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t-4 border-primary font-sans">
      {/* Main Footer Body */}
      <div className="container mx-auto px-4 max-w-6xl pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Col 1: Brand + Social — 5 col */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center space-x-4 mb-6 group">
              <div className="w-16 h-16 bg-white/5 rounded-full p-1 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                <img src="/logo-rw.jpg" alt="Logo RW 10" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span
                  className="block text-2xl font-black text-white tracking-tight leading-none group-hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-bitter)" }}
                >
                  GUYUB 10
                </span>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Portal Resmi RW 10 Desa Cicadas
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-7 text-slate-400 max-w-sm">
              Menyediakan layanan informasi publik, pengajuan surat online, dan
              direktori UMKM warga untuk mewujudkan lingkungan yang transparan,
              modern, dan sejahtera.
            </p>

            {/* Social Media Buttons */}
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                Ikuti Kami
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 ${s.hoverColor}`}
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Links — 3 col */}
          <div className="md:col-span-3">
            <h3
              className="font-black text-white mb-5 uppercase tracking-wider text-sm"
              style={{ fontFamily: "var(--font-bitter)" }}
            >
              Tautan Penting
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary/60 group-hover:text-amber-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact — 4 col */}
          <div className="md:col-span-4">
            <h3
              className="font-black text-white mb-5 uppercase tracking-wider text-sm"
              style={{ fontFamily: "var(--font-bitter)" }}
            >
              Kontak Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-slate-800 p-2 rounded-lg flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm leading-relaxed text-slate-400">
                  Balai Warga RW 10, Jl. Nusantara No. 123,
                  <br />
                  Desa Cicadas, Kec. Maju — 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg flex-shrink-0">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <a
                  href={`https://wa.me/${noWa.replace(/\D/g, '')}`}
                  className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {noWa}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg flex-shrink-0">
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <a
                  href="mailto:kontak@guyub.desa.id"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  kontak@guyub.desa.id
                </a>
              </li>
            </ul>

            {/* CTA Admin */}
            <Link
              href="/admin"
              className="mt-6 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary hover:border-primary text-primary hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 group"
            >
              Dasbor Pengurus
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400 font-semibold">
              Pemerintah RW 10 Desa Cicadas
            </span>
            . Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Syarat & Ketentuan
            </Link>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600">
              Versi 2.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
