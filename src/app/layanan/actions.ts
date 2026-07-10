"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSurat(formData: FormData) {
  const supabase = await createClient();

  // Fitur cetak mandiri tidak memerlukan login.
  // Surat dicetak sendiri oleh warga dan disahkan langsung (fisik) ke RT/RW.

  // Mengambil data dari form
  const jenis = formData.get("jenis") as string;
  const nik = formData.get("nik") as string;
  const keperluan = formData.get("keperluan") as string;
  const tujuan = formData.get("tujuan") as string;
  const lampiran = formData.get("lampiran") as File | null;

  if (!jenis || !keperluan || !tujuan) {
    return { error: "Jenis surat, tujuan, dan keperluan wajib diisi." };
  }

  let lampiranUrl = null;
  // Upload lampiran ke Supabase Storage if it exists
  if (lampiran && lampiran.size > 0) {
    const fileExt = lampiran.name.split('.').pop();
    // Note: Kita tidak menyimpan lampiran karena warga cetak sendiri.
    // Jika butuh penyimpanan, pastikan user_id nullable di database.
  }

  // Generate Nomor Tiket
  const nomorTiket = `TKT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  // Karena ini adalah Cetak Mandiri, kita tidak perlu menyimpan 
  // ke tabel 'surat' (karena user_id wajib di tabel tersebut, dan admin tidak perlu
  // memproses secara digital, melainkan mengecap langsung kertas fisik).
  
  // Jika di masa depan ingin ada riwayat, kita perlu mengubah skema DB (membuat user_id nullable).

  revalidatePath("/admin");
  revalidatePath("/layanan");

  return { success: true, nomorTiket };
}

export async function getKetuaNames(rt: string) {
  const supabase = await createClient();

  // Get RW 10 Name
  const { data: rwData } = await supabase
    .from('profil_rw')
    .select('ketua_nama')
    .limit(1)
    .single();

  // Get RT Name
  let rtData = null;
  if (rt) {
    const { data } = await supabase
      .from('profil_rt')
      .select('ketua_nama')
      .eq('no_rt', rt.replace('RT ', ''))
      .limit(1)
      .single();
    rtData = data;
  }

  return {
    namaKetuaRw: rwData?.ketua_nama || '',
    namaKetuaRt: rtData?.ketua_nama || '',
  };
}
