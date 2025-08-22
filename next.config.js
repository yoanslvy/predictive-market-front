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
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            ? '/lockers/manage/lockers-v2'
            : '/lockers/explore/pools',
        permanent: true,
      },
      {
        source: '/amm/:path*', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            ? '/lockers/manage/lockers-v2'
            : '/lockers/explore/pools',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/chain/:path*', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            ? '/lockers/manage/lockers-v2'
            : '/lockers/explore/pools',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/services', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            ? '/lockers/manage/lockers-v2'
            : '/lockers/explore/pools',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/dashboard', // Match all routes under `/amm`
        destination:
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            ? '/lockers/manage/lockers-v2'
            : '/lockers/explore/pools',
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/uncx-staking', // Match all routes under `/amm`
        destination: 'https://app.uncx.network/staking/explore', // Redirect to external domain
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/staking', // Match all routes under `/amm`
        destination: 'https://app.uncx.network/staking/explore', // Redirect to external domain
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/minter', // Match all routes under `/amm`
        destination: 'https://app.uncx.network/minter/mint', // Redirect to external domain
        permanent: true, // Set false for a 307 Temporary Redirect, true for 308 Permanent Redirect
      },
      {
        source: '/terms/:path*', // Match all routes under `/amm`
        destination: 'https://app.uncx.network/terms-conditions/:path*', // Redirect to external domain
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
