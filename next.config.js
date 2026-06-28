/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pkpzbtuaqkcwjtxifsgj.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
