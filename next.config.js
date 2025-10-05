/** @type {import('next').NextConfig} */
const { createHash } = require('node:crypto')

const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  staticPageGenerationTimeout: 1000,

  async redirects() {
    return [
      {
        source: '/',
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true' ? '/grants/create' : '/grants/explore/latest',
        permanent: true,
      },
      {
        source: '/amm/:path*', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true' ? '/grants/create' : '/grants/explore/latest',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/chain/:path*', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true' ? '/grants/create' : '/grants/explore/latest',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
    ]
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/manifest.json',
  //       destination: '/api/manifest',
  //     },
  //   ];
  // },

  images: {
    remotePatterns: [
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'cryptologos.cc' },
      { hostname: 'i.imgur.com' },
      { hostname: 'imgur.com' },
      { hostname: 'www.dextools.io' },
      { hostname: 'image.mux.com' },
      { hostname: 'dzyb4dm7r8k8w.cloudfront.net' },
      { hostname: 'token-icons.s3.amazonaws.com' },
      { hostname: 'dd.dexscreener.com' },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ({ resource }) => ({
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              {
                name: 'prefixIds',
                params: {
                  delim: '',
                  prefix: createHash('md5').update(resource).digest('hex'),
                },
              },
            ],
          },
        },
      }),
    })

    return config
  },
}

module.exports = nextConfig
