require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { error } = await supabase.rpc('execute_sql', { sql: `
    ALTER TABLE profil_rw ADD COLUMN IF NOT EXISTS password_warga TEXT DEFAULT 'WargaRW10';
  `});
  if (error) {
    console.error('Error with RPC:', error.message);
  } else {
    console.log('Migration done via RPC');
  }
})();
