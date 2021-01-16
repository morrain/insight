const common = require('@game/docs-config')
const { themeConfig } = common // 主题配置单独处理

module.exports = {
  base: '/insight/',
  title: 'InSight(洞见)',
  description: 'vivo游戏事业部前端技术组微服务解决方案',
  ...common,
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
    ...themeConfig
  }
}
