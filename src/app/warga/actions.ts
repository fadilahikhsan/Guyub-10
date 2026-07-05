"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerUmkm(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const nama_usaha = formData.get("nama_usaha") as string;
    const kategori = formData.get("kategori") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const nomor_wa = formData.get("nomor_wa") as string;

    if (!nama_usaha || !kategori || !nomor_wa) {
      return { success: false, error: "Nama Usaha, Kategori, dan Nomor WA wajib diisi." };
    }

    // Insert dengan default is_approved = false
    const { error } = await supabase.from("umkm").insert({
      owner_id: user.id,
      nama_usaha,
      kategori,
      deskripsi,
      nomor_wa,
      is_approved: false
    });

    if (error) throw error;

    revalidatePath("/warga");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mendaftarkan UMKM." };
  }
}
