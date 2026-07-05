// Server Component — fetches session and passes it to the client Navbar
import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil pengumuman penting untuk marquee banner
  const { data: pengumuman } = await supabase
    .from("pengumuman")
    .select("id, judul")
    .eq("kategori", "Penting")
    .order("created_at", { ascending: false })
    .limit(3);

  let role = "user";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) {
      role = profile.role;
    }
  }

  return <NavbarClient user={user} role={role} announcements={pengumuman || []} />;
}
