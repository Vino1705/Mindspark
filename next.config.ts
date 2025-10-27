import type {NextConfig} from 'next';
import 'dotenv/config';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, {isServer}) => {
    if (!isServer) {
      // Exclude server-only modules from client-side bundle
      config.externals.push({
        '@genkit-ai/google-genai': 'commonjs @genkit-ai/google-genai',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
        'firebase-admin/app': 'commonjs firebase-admin/app',
        'firebase-admin/auth': 'commonjs firebase-admin/auth',
        'gaxios': 'commonjs gaxios',
        'google-auth-library': 'commonjs google-auth-library',
        'node-fetch': 'commonjs node-fetch',
        'zod': 'commonjs zod',
      });
    }

    return config;
  },
};

export default nextConfig;
