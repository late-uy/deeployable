/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  outputFileTracingRoot: require('path').join(__dirname, '..'),
};

export default nextConfig;
