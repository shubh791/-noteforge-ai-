/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /postcss-import-parser/,
    ]
    return config
  },
}
module.exports = nextConfig
