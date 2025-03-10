import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode for highlighting potential problems in your application
  reactStrictMode: true,

  // Set custom build directory
  distDir: 'build',

  // Enable trailing slash for all routes
  trailingSlash: true,

  // Configure environment variables
  env: {
    CUSTOM_API_URL: process.env.CUSTOM_API_URL,
  },

  // Customize the headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Custom-Header',
            value: 'My Custom Header Value',
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;