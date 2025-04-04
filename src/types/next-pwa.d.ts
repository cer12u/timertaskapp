declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  function withPWA(config: {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  }): (nextConfig: NextConfig) => NextConfig;
  
  export default withPWA;
}
