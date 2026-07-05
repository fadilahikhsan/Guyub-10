import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import AspirasiList from "./AspirasiList";
import AspirasiForm from "./AspirasiForm";

export default function AspirasiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center text-sm font-bold text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Papan Aspirasi</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>
              Kirim Aspirasi
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-8">
              Sampaikan keluhan, saran, atau masukan untuk lingkungan RW 10 yang lebih baik.
            </p>

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
