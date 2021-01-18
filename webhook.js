const { spawnSync } = require('child_process')
const WebHook = require('webhook').default

new WebHook({
  onPushEvent() {
    spawnSync('git', ['checkout', 'master']) // 检出当前仓库
    spawnSync('git', ['pull']) // 拉取最新代码
    spawnSync('npm', ['run', 'build']) // 顺序构建各个文档
  }
}).listen(3001)
