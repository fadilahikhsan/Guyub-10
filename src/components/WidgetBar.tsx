'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, CloudRain, CloudLightning, Loader2 } from 'lucide-react';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface Weather {
  temp: number;
  condition: string;
  icon: string;
}

export default function WidgetBar() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Prayer Times
        const prayerRes = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Gunung%20Putri&country=Indonesia&method=11');
        if (prayerRes.ok) {
          const prayerData = await prayerRes.json();
          setPrayerTimes({
            Fajr: prayerData.data.timings.Fajr,
            Dhuhr: prayerData.data.timings.Dhuhr,
            Asr: prayerData.data.timings.Asr,
            Maghrib: prayerData.data.timings.Maghrib,
            Isha: prayerData.data.timings.Isha,
          });
        }

        // Fetch Weather (Using Open-Meteo for true free access without API keys, coordinates for Gunung Putri)
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.469&longitude=106.989&current_weather=true');
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          const current = weatherData.current_weather;
          
          let condition = 'Cerah';
          let icon = 'sun';
          
          // Basic WMO Weather interpretation
          if (current.weathercode >= 1 && current.weathercode <= 3) {
            condition = 'Berawan';
            icon = 'cloud';
          } else if (current.weathercode >= 51 && current.weathercode <= 67) {
            condition = 'Hujan';
            icon = 'rain';
          } else if (current.weathercode >= 95) {
            condition = 'Badai Petir';
            icon = 'lightning';
          }

          setWeather({
            temp: current.temperature,
            condition,
            icon,
          });
        }
      } catch (error) {
        console.error('Error fetching widget data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const WeatherIcon = () => {
    if (!weather) return <Sun className="w-3.5 h-3.5" />;
    switch (weather.icon) {
      case 'cloud': return <Cloud className="w-3.5 h-3.5" />;
      case 'rain': return <CloudRain className="w-3.5 h-3.5" />;
      case 'lightning': return <CloudLightning className="w-3.5 h-3.5" />;
      default: return <Sun className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-md text-zinc-200 text-xs py-3 border-t border-white/10 relative z-20">
      <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Moon className="w-3.5 h-3.5" /> Jadwal Sholat:
          </span>
          {loading ? (
            <span className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
            </span>
          ) : prayerTimes ? (
            <>
              <span className="hidden md:inline">
                Subuh {prayerTimes.Fajr} | Dzuhur {prayerTimes.Dhuhr} | Ashar {prayerTimes.Asr} | Maghrib {prayerTimes.Maghrib} | Isya {prayerTimes.Isha}
              </span>
              <span className="md:hidden">
                Subuh {prayerTimes.Fajr} | Maghrib {prayerTimes.Maghrib}
              </span>
            </>
          ) : (
            <span className="text-red-400">Gagal memuat jadwal</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-bold text-sky-400">
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : weather ? (
            <>
              <WeatherIcon /> {weather.condition}, {weather.temp}°C
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5" /> --°C
            </>
          )}
        </div>
      </div>
    </div>
  );
}
