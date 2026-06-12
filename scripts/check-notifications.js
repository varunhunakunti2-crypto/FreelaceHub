const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNotifications() {
  console.log('Checking notifications and projects...');

  // 1. Check projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
  } else {
    console.log('Recent projects:', projects);
  }

  // 2. Check freelancers
  const { data: freelancers, error: freelancersError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('role', 'freelancer');

  if (freelancersError) {
    console.error('Error fetching freelancers:', freelancersError);
  } else {
    console.log('Freelancers count:', freelancers ? freelancers.length : 0);
    if (freelancers) {
      freelancers.forEach(f => console.log(`- ${f.full_name} (${f.id})`));
    }
  }

  // 3. Check notifications
  const { data: notifications, error: notificationsError } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (notificationsError) {
    console.error('Error fetching notifications:', notificationsError);
  } else {
    console.log('Recent notifications count:', notifications ? notifications.length : 0);
    if (notifications) {
      notifications.forEach(n => {
        console.log(`- To: ${n.user_id}, Title: ${n.title}, Created: ${n.created_at}`);
      });
    }
  }
}

checkNotifications();
