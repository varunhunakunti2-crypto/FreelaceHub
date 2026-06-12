const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectSchema() {
  console.log('Inspecting foreign keys...');
  const { data, error } = await supabase.rpc('get_table_foreign_keys', { table_name: 'projects' });
  
  if (error) {
    // If RPC doesn't exist, try another way or just try common names
    console.log('RPC failed, trying to query information_schema directly...');
    const { data: info, error: infoError } = await supabase.from('projects').select('*, profiles(*)').limit(1);
    if (infoError) console.error('Join failed:', infoError.message);
    else console.log('Join worked!');
  } else {
    console.log('Foreign keys:', data);
  }
}

inspectSchema();
