"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitAspirasi(formData: FormData) {
  const supabase = await createClient();

  const nama = (formData.get("nama") as string) || "Anonim";
  const kategori = formData.get("kategori") as string;
  const pesan = formData.get("pesan") as string;

  if (!kategori || !pesan) {
    return { error: "Kategori dan isi pesan wajib diisi." };
  }

  const { error } = await supabase
    .from("aspirasi")
    .insert({
      nama,
      kategori,
      pesan,
      status: "masuk",
    });

  if (error) {
    console.error("Gagal mengirim aspirasi:", error);
    return { error: "Gagal mengirim aspirasi." };
  }

  revalidatePath("/aspirasi");
  revalidatePath("/admin");

  return { success: true };
}
