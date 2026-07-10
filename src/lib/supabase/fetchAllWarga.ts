import { createAdminClient } from './admin';

type WargaSelectFields = 'rt,jenis_kelamin,tanggal_lahir,no_kk' | 'id,nama_lengkap,nik,jenis_kelamin,tanggal_lahir,pekerjaan,status_perkawinan,no_kk,status_warga';

/**
 * Fetch semua data warga menggunakan pagination (batch 1000).
 * Mengatasi batas default PostgREST 1000 baris per request.
 */
export async function fetchAllWarga(fields: WargaSelectFields, rtFilter?: string) {
  const adminSupabase = createAdminClient();
  const PAGE_SIZE = 1000;
  let allData: Record<string, unknown>[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = adminSupabase
      .from('warga')
      .select(fields)
      .range(from, from + PAGE_SIZE - 1)
      .order('id', { ascending: true });

    if (rtFilter) {
      query = query.eq('rt', rtFilter);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      hasMore = false;
    } else {
      allData = [...allData, ...data];
      from += PAGE_SIZE;
      // Kalau hasil < PAGE_SIZE, berarti sudah habis
      if (data.length < PAGE_SIZE) hasMore = false;
    }
  }

  return allData;
}
