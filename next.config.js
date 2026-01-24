/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xbrynwcebdgsbaolpphn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  eslint: {
    // Desabilitado temporariamente devido a incompatibilidade ESLint 8 + Next.js 15
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig