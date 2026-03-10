/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://useyeyu.cc',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/auth/*', '/api/*', '/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/*', '/auth/', '/auth/*'],
      },
    ],
  },
}
