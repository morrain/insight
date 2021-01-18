module.exports = {
  base: '/insight/',
  title: 'InSight(洞见)',
  description: 'vivo游戏事业部前端技术组微服务解决方案',
  head: [
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: '更新日志',
        link: '/CHANGELOG'
      },
      {
        text: 'NPM',
        link: 'http://npm.vivo.com.cn/#/detail/@game/insight'
      }
    ],
    sidebar: ['/guide/', '/guide/getting-started', '/api/', '/faq/'],
    repoLabel: 'GitLab',
    repo: 'https://gitlab.vmic.xyz/game-common/insight',
    lastUpdated: '最后更新',
    smoothScroll: true,
    sidebarDepth: 2
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@vuepress/back-to-top',
    [
      'vuepress-plugin-container',
      {
        type: 'center',
        before: info => `<div align=center>`,
        after: '</div>'
      }
    ]
  ]
}
