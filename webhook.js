const { spawnSync } = require('child_process')
const WebHook = require('webhook').default

new WebHook({
  onPushEvent() {
    spawnSync('git', ['checkout', 'master'])
    spawnSync('git', ['pull'])
    spawnSync('npm', ['run', 'docs:build'])
  }
}).listen(3001)
