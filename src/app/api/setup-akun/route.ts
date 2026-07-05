import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Force all users to be admin
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error });

  for (const user of users.users || []) {
    // Gunakan upsert agar jika datanya belum ada di profiles, otomatis dibuatkan
    await supabase.from("profiles").upsert({ 
      id: user.id, 
      role: "admin",
      nama_lengkap: user.user_metadata?.nama_lengkap || "Admin Baru",
      rt: user.user_metadata?.rt || "1"
    });
  }

  return NextResponse.json({ success: true, message: "Semua akun sekarang adalah admin" });
}
