"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSurat(formData: FormData) {
  const supabase = await createClient();

  // Memastikan pengguna sudah login
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda harus login untuk mengajukan surat." };
  }

  // Mengambil data dari form
  const jenis = formData.get("jenis") as string;
  const nik = formData.get("nik") as string;
  const keperluan = formData.get("keperluan") as string;
  const tujuan = formData.get("tujuan") as string;
  const lampiran = formData.get("lampiran") as File | null;

  if (!jenis || !keperluan || !tujuan || !lampiran || lampiran.size === 0) {
    return { error: "Jenis surat, tujuan, keperluan, dan lampiran wajib diisi." };
  }

  // Upload lampiran ke Supabase Storage
  const fileExt = lampiran.name.split('.').pop();
  const fileName = `${user.id}_${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from("surat_lampiran")
    .upload(fileName, lampiran);

  if (uploadError) {
    console.error("Gagal mengunggah lampiran:", uploadError);
    return { error: "Gagal mengunggah lampiran dokumen." };
  }

  const { data: publicUrlData } = supabase.storage
    .from("surat_lampiran")
    .getPublicUrl(fileName);
    
  const lampiranUrl = publicUrlData.publicUrl;

  // Generate Nomor Tiket
  const nomorTiket = `TKT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  // Menyimpan ke database
  const { error: insertError } = await supabase
    .from("surat")
    .insert({
      user_id: user.id,
      jenis_surat: jenis,
      nik_pemohon: nik,
      keperluan: keperluan,
      lampiran_url: lampiranUrl,
      tujuan: tujuan,
      nomor_tiket: nomorTiket,
    });

  if (insertError) {
    console.error("Gagal mengajukan surat:", insertError);
    return { error: "Terjadi kesalahan pada sistem. Gagal mengajukan surat." };
  }

  revalidatePath("/admin");
  revalidatePath("/layanan");

  return { success: true, nomorTiket };
}
