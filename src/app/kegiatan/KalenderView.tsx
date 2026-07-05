"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Info, Calendar } from "lucide-react";

interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  kategori: string;
  penyelenggara: string;
  foto_url: string;
}

export default function KalenderView({ data }: { data: Kegiatan[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = data.reduce((acc, event) => {
    const dateStr = new Date(event.tanggal).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, Kegiatan[]>);

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const selectedDateStr = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : null;
  const selectedEvents = selectedDateStr ? eventsByDate[selectedDateStr] || [] : [];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Calendar Grid */}
      <div className="flex-1 bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-border/60">
          <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-muted-foreground" /></button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-bold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {blanks.map(b => (
              <div key={`blank-${b}`} className="aspect-square"></div>
            ))}
            
            {days.map(day => {
              const currentFullDate = new Date(year, month, day);
              const dateStr = new Date(currentFullDate.getTime() - currentFullDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              const hasEvents = eventsByDate[dateStr] && eventsByDate[dateStr].length > 0;
              const isToday = new Date().toDateString() === currentFullDate.toDateString();
              const isSelected = selectedDate?.toDateString() === currentFullDate.toDateString();
              
              return (
                <button 
                  key={day} 
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-xl relative flex items-center justify-center font-medium transition-all
                    ${isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-foreground'}
                    ${isToday && !isSelected ? 'border-2 border-primary text-primary' : 'border border-transparent'}
                  `}
                >
                  {day}
                  {hasEvents && (
                    <div className="absolute bottom-2 flex gap-1 justify-center w-full">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`}></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Events Detail Panel */}
      <div className="w-full md:w-80 shrink-0">
        <div className="bg-muted/30 rounded-3xl p-6 border border-border/60 min-h-[400px]">
          {selectedDate ? (
            <>
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h4>
              
              {selectedEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedEvents.map(event => (
                    <div key={event.id} className="bg-card p-4 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                      <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                        {event.kategori}
                      </span>
                      <h5 className="font-bold text-sm mb-2">{event.judul}</h5>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary/60"/> 
                          {new Date(event.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent/60"/> 
                          {event.lokasi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">Tidak ada kegiatan di tanggal ini.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center h-full">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">Pilih tanggal pada kalender untuk melihat kegiatan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
