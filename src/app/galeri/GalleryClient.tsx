"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  category: string;
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(item)}
          >
            {/* Aspect ratio 4:3 */}
            <div className="aspect-[4/3] w-full bg-muted">
              {/* Fallback pattern for demo if image fails or doesn't exist */}
              <div className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-gradient-to-br from-primary/20 to-navy/20 geo-pattern flex items-center justify-center">
                <span className="text-white font-black text-xl opacity-30 tracking-widest">{item.category}</span>
              </div>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span className="inline-block bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded w-max mb-2 uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-white font-bold text-lg leading-tight flex justify-between items-center">
                {item.title}
                <ZoomIn className="w-5 h-5 text-white/70" />
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-video bg-gradient-to-br from-primary/30 to-navy/30 geo-pattern rounded-2xl shadow-2xl flex items-center justify-center border border-white/10">
              <span className="text-white font-black text-4xl opacity-50">{selectedImage.category}</span>
            </div>
            <div className="mt-6 text-center">
              <span className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-2 block">{selectedImage.category}</span>
              <h3 className="text-white text-2xl font-black">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
