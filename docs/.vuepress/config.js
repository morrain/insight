module.exports = {
  title: 'InSight(洞见)',
  description: 'vivo游戏事业部前端技术组微服务解决方案',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      {
        text: '更新日志',
        link: '/changelog/'
      }
    ],
    sidebar: ['/guide/', '/guide/getting-started', '/api/', '/faq/'],
    lastUpdated: '最后更新',
    smoothScroll: true,
    sidebarDepth: 2,
    repoLabel: 'GitLab',
    repo: 'https://gitlab.vmic.xyz/game-common/insight'
  },
  plugins: [
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
