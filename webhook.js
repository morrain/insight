const { spawnSync } = require('child_process')
const WebHook = require('webhook').default

new WebHook({
  onTagEvent() {
    spawnSync('git', ['checkout', 'master'])
    spawnSync('git', ['pull'])
    spawnSync('npm', ['run', 'docs:build'])
  }
}).listen(4001)
