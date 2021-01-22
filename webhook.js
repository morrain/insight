const { spawnSync } = require('child_process')
const WebHook = require('webhook').default

new WebHook({
  onPushEvent() {
    spawnSync('git', ['checkout', 'master'])
    spawnSync('git', ['restore', 'package-lock.json']) // package.json安装后会变化，导致下一次git pull时会失败
    spawnSync('git', ['pull'])
    spawnSync('npm', ['run', 'docs:build'])
  }
}).listen(3001)
