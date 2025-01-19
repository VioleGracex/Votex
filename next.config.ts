import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode for highlighting potential problems in your application
  reactStrictMode: true,

  // Set custom build directory
  distDir: 'build',

  // Enable Webpack 5

  // Add custom webpack configuration

  // i18n configuration for internationalized routing
  i18n: {
    locales: ['en', 'es', 'fr', 'ru'],
    defaultLocale: 'ru',
  },

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
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;