/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alhimik-studio.ru',
      },
    ],
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig
