/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化設定
  experimental: {
    optimizeCss: true,
  },

  // コンパイル設定
  swcMinify: true,

  // 画像最適化
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // バンドル分析（環境変数ANALYZE=trueで有効化）
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // バンドル分析
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }

    // チャンク分割の最適化 - 動的importエラーを解決
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            components: {
              name: 'components',
              test: /[\\/]src[\\/]components[\\/]/,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    // dynamic import の fallback 設定
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    return config
  },

  // 出力設定
  output: 'standalone',

  // パフォーマンス警告設定
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
