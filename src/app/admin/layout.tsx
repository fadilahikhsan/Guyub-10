import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Daftar email yang boleh masuk ke panel admin
const ADMIN_EMAILS = ["admin@gmail.com", "fadilahikhsann@gmail.com"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belum login → ke halaman login
  if (!user) {
    redirect("/login");
  }

  // Login tapi bukan admin → ke beranda
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">Admin Guyub</h1>
          <div className="text-sm font-bold bg-white/20 px-4 py-2 rounded-xl">
            {user?.email}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
