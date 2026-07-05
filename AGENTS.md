<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WORKFLOW RULES FOR AI
Setiap kali pengguna (user) meminta untuk "melanjutkan ke langkah berikutnya" (atau semacamnya), Anda **DIWAJIBKAN** untuk:
1. Membaca `PROGRESS.md` untuk mengetahui posisi Roadmap saat ini.
2. Mengaudit kode singkat untuk memastikan langkah sebelumnya sudah benar-benar selesai.
3. Mengeksekusi/Mengerjakan langkah *Roadmap* berikutnya.
4. **SECARA OTOMATIS memperbarui `PROGRESS.md`** dengan menandai langkah yang baru saja diselesaikan, tanpa harus diminta atau disuruh oleh user.
5. **BERIKAN INSTRUKSI KEPADA USER** di kolom chat apabila ada pekerjaan manual yang tidak bisa dilakukan oleh AI (contoh: *copy-paste* API Keys, eksekusi migrasi SQL secara manual di Dashboard Supabase, atau pengaturan *Environment Variables* di Vercel). Jangan berasumsi user akan melakukannya sendiri tanpa diberi tahu.
