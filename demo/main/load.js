/**
 * 手动加载微服务
 */

import {
  loadMicroApp, prefetchApps
} from '../../es';

/**
 * Step0 预加载卡片
 */
prefetchApps([{
  entry: '//localhost:7104/game-card/'
}])

/**
 * Step1 加载卡片
 */
let cardInstance = null

export const load = ()=>{

    cardInstance = loadMicroApp({
      name: 'gamecard',
      entry: '//localhost:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
      container: '#gamecard-container',
      props: {
        moduleId: 184,
        origin: 'demo'
      }
    }, {
      sandbox: false
    },{
      beforeLoad: [
        app => {
          console.log('[loadMicroApp][LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ],
      afterMount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] after mount %c%s', 'color: green;', app.name);
          update(app.name) // 切换应用后，相应的更新卡片
        },
      ],
      beforeUnmount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] before unmount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    })
}


/**
 * Step2 更新卡片
 */

export const update = name  => {
  if (cardInstance && cardInstance.getStatus() === 'MOUNTED') {
    if (name === 'vue') {
      cardInstance.update({
        moduleId: 187,
        origin: name
      })
    } else if (name === 'vue3') {
      cardInstance.update({
        moduleId: 184,
        origin: name
      })
    } else if (name === 'purehtml') {
      cardInstance.update({
        moduleId: 186,
        origin: name
      })
    }
  } 
}
