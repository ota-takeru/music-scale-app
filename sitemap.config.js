module.exports = {
  siteUrl: 'https://music-tool.com',
  generateRobotsTxt: true,
  include: ['/scaleSearch/index.js', '/scaleSearch/[id].js'],
  // ここでページのパスを指定することで、サイトマップから除外することができます
  // 上記の例では、scaleSearchディレクトリの中のindex.jsと[id].jsを除外しています
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://music-tool.com/sitemap/scaleSearch.xml',
      'https://music-tool.com/sitemap/scaleSearch/id.xml',
    ],
  },
  
}
