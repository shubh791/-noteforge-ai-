/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /postcss-import-parser/,
    ]
    return config
  },
}
module.exports = nextConfig
