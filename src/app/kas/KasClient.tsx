"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";

interface KasData {
  id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jumlah: number;
  jenis: string;
  entitas_type?: string;
  entitas_id?: string;
}

export default function KasClient({ initialData }: { initialData: KasData[] }) {
  const [selectedEntitas, setSelectedEntitas] = useState<string>("RW"); // Default RW, or 'SEMUA'
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());

  const years = Array.from(new Set(initialData.map(k => new Date(k.tanggal).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
  if (!years.includes(new Date().getFullYear().toString())) {
    years.unshift(new Date().getFullYear().toString());
  }

  const months = [
    { value: "0", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" }
  ];

  // Filter data by entitas first
  const dataByEntitas = useMemo(() => {
    if (selectedEntitas === "SEMUA") return initialData;
    return initialData.filter(kas => {
      if (selectedEntitas === "RW") return kas.entitas_type === "RW" || !kas.entitas_type; // Fallback for old data
      if (selectedEntitas.startsWith("RT-")) {
        return kas.entitas_type === "RT" && kas.entitas_id === selectedEntitas.split("-")[1];
      }
      if (selectedEntitas.startsWith("LEMBAGA-")) {
        return kas.entitas_type === "Lembaga" && kas.entitas_id === selectedEntitas.split("-")[1];
      }
      return true;
    });
  }, [initialData, selectedEntitas]);

  // Calculate totals
  let totalSaldo = 0;
  dataByEntitas.forEach(k => {
    if (k.jenis === 'masuk') totalSaldo += Number(k.jumlah);
    else totalSaldo -= Number(k.jumlah);
  });

  const filteredData = useMemo(() => {
    return dataByEntitas.filter(kas => {
      const kasDate = new Date(kas.tanggal);
      const matchesYear = kasDate.getFullYear().toString() === selectedYear;
      const matchesMonth = selectedMonth === "0" || (kasDate.getMonth() + 1).toString() === selectedMonth;
      return matchesYear && matchesMonth;
    });
  }, [dataByEntitas, selectedYear, selectedMonth]);

  let totalMasukFilter = 0;
  let totalKeluarFilter = 0;

  filteredData.forEach(k => {
    if (k.jenis === 'masuk') totalMasukFilter += Number(k.jumlah);
    else totalKeluarFilter += Number(k.jumlah);
  });

  // Prepare chart data (group by date if month is selected, or group by month if 'Semua Bulan' is selected)
  const chartData = useMemo(() => {
    const dataMap: Record<string, { masuk: number, keluar: number }> = {};
    
    if (selectedMonth === "0") {
      // Group by month
      filteredData.forEach(kas => {
        const month = new Date(kas.tanggal).getMonth() + 1;
        const key = `Bulan ${month}`;
        if (!dataMap[key]) dataMap[key] = { masuk: 0, keluar: 0 };
        if (kas.jenis === 'masuk') dataMap[key].masuk += Number(kas.jumlah);
        else dataMap[key].keluar += Number(kas.jumlah);
      });
    } else {
      // Group by date
      filteredData.forEach(kas => {
        const dateStr = new Date(kas.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
        if (!dataMap[dateStr]) dataMap[dateStr] = { masuk: 0, keluar: 0 };
        if (kas.jenis === 'masuk') dataMap[dateStr].masuk += Number(kas.jumlah);
        else dataMap[dateStr].keluar += Number(kas.jumlah);
      });
    }

    return Object.entries(dataMap).map(([name, values]) => ({
      name,
      masuk: values.masuk,
      keluar: values.keluar
    }));
  }, [filteredData, selectedMonth]);

  return (
    <>
      {/* Ringkasan & Filter */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-end justify-between">
        <div className="flex-1 bg-card rounded-3xl p-6 border border-border shadow-lg flex flex-col items-start md:items-center text-left md:text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase mb-1">Total Saldo Kas {selectedEntitas === "RW" ? "RW Utama" : (selectedEntitas === "SEMUA" ? "Keseluruhan" : selectedEntitas)}</p>
          <p className="text-3xl font-black text-foreground">Rp {totalSaldo.toLocaleString("id-ID")}</p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 bg-muted/50 p-4 rounded-2xl border border-border">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-1">
            <Filter className="w-4 h-4" /> Filter Laporan
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedEntitas}
              onChange={(e) => setSelectedEntitas(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card font-medium text-foreground focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="SEMUA">Semua Entitas</option>
              <option value="RW">Kas RW Utama</option>
              <option disabled>── KAS RT ──</option>
              <option value="RT-01">RT 01</option>
              <option value="RT-02">RT 02</option>
              <option value="RT-03">RT 03</option>
              <option value="RT-04">RT 04</option>
              <option value="RT-05">RT 05</option>
              <option value="RT-06">RT 06</option>
              <option value="RT-07">RT 07</option>
              <option value="RT-08">RT 08</option>
              <option disabled>── KAS LEMBAGA ──</option>
              <option value="LEMBAGA-pkk">PKK</option>
              <option value="LEMBAGA-karang-taruna">Karang Taruna</option>
              <option value="LEMBAGA-posyandu">Posyandu</option>
            </select>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card font-medium text-foreground focus:ring-1 focus:ring-primary outline-none"
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card font-medium text-foreground focus:ring-1 focus:ring-primary outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] -z-10 group-hover:bg-green-500/20 transition-colors"></div>
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase mb-1">Pemasukan (Filter)</p>
          <p className="text-3xl font-black text-green-600">+Rp {totalMasukFilter.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -z-10 group-hover:bg-red-500/20 transition-colors"></div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase mb-1">Pengeluaran (Filter)</p>
          <p className="text-3xl font-black text-red-600">-Rp {totalKeluarFilter.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 mb-12">
        <h3 className="text-lg font-bold text-foreground mb-6 text-center" style={{ fontFamily: "var(--font-bitter)" }}>Grafik Arus Kas</h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(val) => `Rp ${val / 1000}k`} width={80} />
                <Tooltip 
                  formatter={(value) => [`Rp ${Number(value ?? 0).toLocaleString("id-ID")}`, '']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="masuk" name="Pemasukan" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="keluar" name="Pengeluaran" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground font-medium">
              Tidak ada data grafik untuk filter yang dipilih.
            </div>
          )}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "var(--font-bitter)" }}>Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground font-medium">Belum ada riwayat transaksi pada filter ini.</td>
                </tr>
              ) : (
                filteredData.map(kas => (
                  <tr key={kas.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                      {new Date(kas.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{kas.keterangan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-muted border border-border text-muted-foreground px-2 py-1 rounded text-xs font-bold uppercase">{kas.kategori}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black whitespace-nowrap ${kas.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                      {kas.jenis === 'masuk' ? '+' : '-'} Rp {Number(kas.jumlah).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
