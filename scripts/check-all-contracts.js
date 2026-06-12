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

async function checkAllContracts() {
  console.log('Checking all contracts...');
  const { data: contracts, error } = await supabase
    .from('contracts')
    .select(`
      *,
      project:projects(title, status),
      freelancer:profiles!contracts_freelancer_id_fkey(full_name),
      client:profiles!contracts_client_id_fkey(full_name)
    `);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Total contracts:', contracts.length);
    contracts.forEach(c => {
      console.log(`- Contract ${c.id}: Project "${c.project?.title}" (${c.project?.status}), Freelancer: ${c.freelancer?.full_name}, Client: ${c.client?.full_name}`);
    });
  }
}

checkAllContracts();
