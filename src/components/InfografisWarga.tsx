"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";

export function InfografisWarga({ data }: { data: { genderData: any[], ageData: any[], rtData: any[], totalWarga: number, totalKK: number } }) {
  const COLORS = ['#0ea5e9', '#f43f5e', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

  // Komponen Tooltip Kustom agar terlihat lebih elegan dan modern
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-100 shadow-xl p-3 rounded-2xl ring-1 ring-slate-900/5">
          <p className="font-bold text-slate-800 text-sm mb-1">{label || payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill || payload[0].color || COLORS[0] }} />
            <p className="font-black text-slate-900">
              {payload[0].value} <span className="font-medium text-slate-500 text-xs">Jiwa</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="container mx-auto px-4 max-w-6xl my-16 md:my-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-2xl mb-5 ring-4 ring-primary/5">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight" style={{ fontFamily: "var(--font-bitter)" }}>
          Statistik Warga RW 10
        </h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Transparansi data kependudukan untuk perencanaan pembangunan yang lebih baik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Card Total Warga */}
        <div className="bg-gradient-to-br from-primary via-primary to-emerald-800 text-white rounded-3xl p-8 flex flex-col justify-center items-center shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-highlight/20 blur-[40px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-lg font-bold mb-2 text-white/80 uppercase tracking-widest">Total Populasi</p>
            <p className="text-7xl font-black mb-4 drop-shadow-md tracking-tighter">{data.totalWarga}</p>
            <div className="bg-black/10 px-5 py-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-sm font-medium text-white/90">
                Terdiri dari <span className="font-black text-highlight text-lg ml-1">{data.totalKK}</span> KK
              </p>
            </div>
          </div>
        </div>

        {/* Chart Gender */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <h3 className="text-base font-black text-slate-800 mb-6 text-center uppercase tracking-wider">Distribusi Gender</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  cornerRadius={10}
                  dataKey="value"
                  stroke="none"
                >
                  {data.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart RT */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <h3 className="text-base font-black text-slate-800 mb-6 text-center uppercase tracking-wider">Sebaran per RT</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.rtData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" strokeWidth={2} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={55} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {data.rtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Usia - Full Width */}
      <div className="mt-6 md:mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
        <h3 className="text-base font-black text-slate-800 mb-8 text-center uppercase tracking-wider">Demografi Usia Warga</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeWidth={2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                {data.ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
