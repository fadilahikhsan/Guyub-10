"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitLaporan(formData: FormData) {
  const supabase = await createClient();

  const nama_pelapor = (formData.get("nama_pelapor") as string) || "Anonim";
  const kategori = formData.get("kategori") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const lokasi = formData.get("lokasi") as string;
  const file = formData.get("foto") as File;

  if (!kategori || !deskripsi) {
    return { error: "Kategori dan deskripsi wajib diisi" };
  }

  let foto_url = "";

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `laporan/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("public_assets")
      .upload(filePath, file);

    if (uploadError) {
      return { error: "Gagal mengunggah foto: " + uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("public_assets")
      .getPublicUrl(filePath);

    foto_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("laporan_infrastruktur").insert({
    nama_pelapor,
    kategori,
    deskripsi,
    lokasi,
    foto_url,
    status: "dilaporkan",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/laporan");
  return { success: true };
}
