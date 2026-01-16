/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.externals.push({
      '@huggingface/transformers': '@huggingface/transformers',
    });
    return config;
  },
};

export default nextConfig;
