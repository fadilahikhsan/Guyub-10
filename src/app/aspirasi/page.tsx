import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import AspirasiList from "./AspirasiList";
import AspirasiForm from "./AspirasiForm";

export default function AspirasiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden min-h-[300px]">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=80"
            alt="Aspirasi Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-[rgba(13,33,25,0.95)]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-6xl py-20 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm font-bold text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Papan Aspirasi</span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
            Kirim Aspirasi
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
            Sampaikan keluhan, saran, atau masukan untuk lingkungan RW 10 yang lebih baik.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>

            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              <AspirasiForm />
            </div>
          </div>

          {/* List Section */}
          <div className="bg-muted/30 rounded-3xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>Papan Publik</h2>
            </div>
            
            <AspirasiList />
          </div>
        </div>
      </div>
    </div>
  );
}
