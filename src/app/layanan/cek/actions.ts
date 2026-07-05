"use server";

import { createClient } from "@/lib/supabase/server";

export async function cekStatusSurat(nomorTiket: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surat")
    .select("status, jenis_surat, catatan_admin, pdf_url, created_at, profiles(nama_lengkap)")
    .eq("nomor_tiket", nomorTiket.trim().toUpperCase())
    .single();

  if (error || !data) {
    return { error: "Surat dengan nomor tiket tersebut tidak ditemukan." };
  }

  return { data };
}
