import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);

export default config;
