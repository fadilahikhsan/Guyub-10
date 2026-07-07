"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RtChartsProps {
  genderData: { name: string; value: number }[];
  ageData: { name: string; value: number }[];
  totalWarga: number;
  totalKK: number;
  kasSummary: {
    totalMasuk: number;
    totalKeluar: number;
    saldo: number;
    kasData: { tanggal: string; keterangan: string; jenis: string; jumlah: number; kategori: string }[];
  };
}

const COLORS = ['#0ea5e9', '#f43f5e', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

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

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

export default function RtCharts({ genderData, ageData, totalWarga, totalKK, kasSummary }: RtChartsProps) {
  return (
    <div className="space-y-8">
      {/* ── Stats Cards Row ───────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl p-5 shadow-lg shadow-sky-200/40 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 blur-[30px] rounded-full" />
          <Users className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-3xl font-black">{totalWarga}</p>
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Total Warga</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-5 shadow-lg shadow-violet-200/40 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 blur-[30px] rounded-full" />
          <Users className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-3xl font-black">{totalKK}</p>
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Kepala Keluarga</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-200/40 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 blur-[30px] rounded-full" />
          <ArrowUpRight className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-black">{formatRupiah(kasSummary.totalMasuk)}</p>
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Pemasukan</p>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl p-5 shadow-lg shadow-rose-200/40 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 blur-[30px] rounded-full" />
          <ArrowDownRight className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-black">{formatRupiah(kasSummary.totalKeluar)}</p>
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Pengeluaran</p>
        </div>
      </div>

      {/* ── Charts Row ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Donut */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-base font-black text-slate-800 mb-6 text-center uppercase tracking-wider">Jenis Kelamin</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} cornerRadius={10} dataKey="value" stroke="none">
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-base font-black text-slate-800 mb-6 text-center uppercase tracking-wider">Demografi Usia</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeWidth={2} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={30}>
                  {ageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Kas Saldo Card ───────────────── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-white/60 uppercase tracking-widest">Saldo Kas</p>
              <p className={`text-3xl md:text-4xl font-black ${kasSummary.saldo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRupiah(kasSummary.saldo)}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-1"><TrendingUp className="w-3.5 h-3.5" /> Masuk</div>
              <p className="font-black text-lg">{formatRupiah(kasSummary.totalMasuk)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-rose-400 text-xs font-bold mb-1"><TrendingDown className="w-3.5 h-3.5" /> Keluar</div>
              <p className="font-black text-lg">{formatRupiah(kasSummary.totalKeluar)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kas Transaction Table ────────── */}
      {kasSummary.kasData.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">Riwayat Transaksi Kas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left py-3 px-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Keterangan</th>
                  <th className="text-left py-3 px-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Kategori</th>
                  <th className="text-right py-3 px-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {kasSummary.kasData.slice(0, 15).map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5 text-slate-600 font-medium whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="py-3 px-5 text-slate-800 font-semibold">{item.keterangan}</td>
                    <td className="py-3 px-5"><span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">{item.kategori}</span></td>
                    <td className={`py-3 px-5 text-right font-black whitespace-nowrap ${item.jenis === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.jenis === 'masuk' ? '+' : '-'}{formatRupiah(item.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
