/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['xbrynwcebdgsbaolpphn.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    allowMiddlewareResponseBody: true,
  }
}

module.exports = nextConfig