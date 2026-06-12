const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing environment variable: ${key}`);
  }
});

const imageDomains = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    imageDomains.push(supabaseUrl.hostname.replace('https://', '').replace('http://', ''));
  } catch (error) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is not a valid URL');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: imageDomains,
  },
};

module.exports = nextConfig;
