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

async function debugDeepekaContracts() {
  const deepekaId = '4598242d-daab-44a6-b0c7-c677aac4e510';
  console.log(`Debugging contracts for deepeka (${deepekaId})...`);

  // 1. Raw contracts check
  const { data: rawContracts, error: rawError } = await supabase
    .from('contracts')
    .select('*')
    .eq('freelancer_id', deepekaId);

  console.log('Raw contracts count:', rawContracts ? rawContracts.length : 0);
  if (rawContracts) {
    rawContracts.forEach(c => console.log(`- ID: ${c.id}, Status: ${c.status}, ProjectID: ${c.project_id}`));
  }

  // 2. Joined check
  const { data: joinedContracts, error: joinedError } = await supabase
    .from('contracts')
    .select(`
      id,
      status,
      project:projects(id, title, status)
    `)
    .eq('freelancer_id', deepekaId);

  console.log('\nJoined contracts (Project info):');
  if (joinedError) console.error('Join Error:', joinedError);
  if (joinedContracts) {
    joinedContracts.forEach(c => {
      console.log(`- Contract ${c.id}: Project "${c.project?.title || 'NULL'}", Project Status: ${c.project?.status || 'NULL'}`);
    });
  }
}

debugDeepekaContracts();
