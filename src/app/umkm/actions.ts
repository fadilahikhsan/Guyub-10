"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitUmkm(formData: FormData) {
  const supabase = await createClient();

  const namaPemilik = formData.get("nama_pemilik") as string;
  const namaUsaha = formData.get("nama_usaha") as string;
  const kategori = formData.get("kategori") as string;
  const nomorWa = formData.get("nomor_wa") as string;
  const alamat = formData.get("alamat") as string;
  const jamBuka = formData.get("jam_buka") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const logo = formData.get("logo") as File | null;

  if (!namaPemilik || !namaUsaha || !kategori || !nomorWa || !deskripsi) {
    return { error: "Semua kolom yang ditandai bintang (*) wajib diisi." };
  }

  let fotoUrl = null;

  // Upload logo ke Supabase Storage (umkm_logo)
  if (logo && logo.size > 0) {
    const fileExt = logo.name.split('.').pop();
    const fileName = `umkm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("umkm_logo")
      .upload(fileName, logo);

    if (uploadError) {
      console.error("Gagal mengunggah logo UMKM:", uploadError);
      return { error: "Gagal mengunggah logo. Silakan coba gambar lain." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("umkm_logo")
      .getPublicUrl(fileName);

    fotoUrl = publicUrlData.publicUrl;
  }

  // Insert ke database (is_approved = false)
  const { error: insertError } = await supabase
    .from("umkm")
    .insert({
      nama_pemilik: namaPemilik,
      nama_usaha: namaUsaha,
      kategori: kategori,
      nomor_wa: nomorWa,
      alamat: alamat,
      jam_buka: jamBuka,
      deskripsi: deskripsi,
      foto_url: fotoUrl,
      is_approved: false
    });

  if (insertError) {
    console.error("Gagal menyimpan data UMKM:", insertError);
    return { error: "Terjadi kesalahan pada sistem saat menyimpan data UMKM." };
  }

  // Revalidate halaman untuk memastikan admin dashboard ter-update
  revalidatePath("/admin");
  revalidatePath("/umkm");

  return { success: true };
}
