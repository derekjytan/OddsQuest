/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      (async () => {
        const scheduler = await import('./lib/scheduler.js');
        scheduler.initializeScheduler();
      })();
    }
    return config;
  },
};

export default nextConfig;
