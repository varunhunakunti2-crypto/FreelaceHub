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

async function checkProject() {
  const id = '677375b2-c811-46a9-ba70-427c0eeb34ab';
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  console.log('Project details:', data);
  if (error) console.error('Error:', error);
}

checkProject();
