"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";

export function InfografisWarga({ data }: { data: { genderData: any[], ageData: any[], rtData: any[], totalWarga: number, totalKK: number } }) {
  const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <section className="container mx-auto px-4 max-w-6xl my-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4" style={{ fontFamily: "var(--font-bitter)" }}>
          Statistik Warga RW 10
        </h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Transparansi data kependudukan untuk perencanaan pembangunan yang lebih baik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Total Warga */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 flex flex-col justify-center items-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[50px] rounded-full"></div>
          <p className="text-xl font-bold mb-2 opacity-90">Total Populasi</p>
          <p className="text-6xl font-black mb-4">{data.totalWarga}</p>
          <p className="text-lg font-medium opacity-90 text-center">
            Terdiri dari <span className="font-bold">{data.totalKK}</span> Kepala Keluarga
          </p>
        </div>

        {/* Chart Gender */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 text-center">Distribusi Jenis Kelamin</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} jiwa`, 'Jumlah']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart RT */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 text-center">Sebaran per RT</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.rtData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => [`${value} jiwa`, 'Jumlah']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
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
      <div className="mt-6 bg-card border border-border rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-6 text-center">Distribusi Usia Warga</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => [`${value} jiwa`, 'Jumlah']} />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
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
