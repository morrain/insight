/**
 * 手动加载微服务
 */

import {
  loadMicroApp,
  prefetchApps
} from '../../es';

/**
 * Step0 预加载卡片
 */
prefetchApps([{
  entry: '//game-card.vivo.com.cn:7104/game-card/'
}])

/**
 * Step1 加载卡片
 */
let cardInstance1 = null
let cardInstance2 = null

export const loadCard1 = () => {

  if(cardInstance1 && cardInstance1.getStatus() === 'MOUNTED')  {
    return
  }

  if(cardInstance1 && cardInstance1.getStatus() === 'NOT_MOUNTED')  {
    cardInstance1.mount()
    return
  }

  cardInstance1 = loadMicroApp({
    name: 'gamecard1',
    entry: '//game-card.vivo.com.cn:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
    container: '#gamecard-container1',
    props: {
      reportData: {
        package_name: 'com.tencent.tmgp.sgame',
        dl_page: 'default',
      }
    }
  }, null , {
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

export const unloadCard1 = () => {
  if(cardInstance1 && cardInstance1.getStatus() === 'MOUNTED') cardInstance1.unmount()
}

export const loadCard2 = () => {

  if(cardInstance2 && cardInstance2.getStatus() === 'MOUNTED')  {
    return
  }

  if(cardInstance2 && cardInstance2.getStatus() === 'NOT_MOUNTED')  {
    cardInstance2.mount()
    return
  }

  cardInstance2 = loadMicroApp({
    name: 'gamecard2',
    entry: '//game-card.vivo.com.cn:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
    container: '#gamecard-container2',
    props: {
      reportData: {
        package_name: 'com.tencent.tmgp.sgame',
        dl_page: 'default',
      }
    }
  },null, {
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

export const unloadCard2 = () => {
  if(cardInstance2 && cardInstance2.getStatus() === 'MOUNTED') cardInstance2.unmount()
}

/**
 * Step2 更新卡片
 */

export const update = () => {
  if (cardInstance1 && cardInstance1.getStatus() === 'MOUNTED') {
    cardInstance1.update({
      reportData: {
        package_name: 'com.minitech.miniworld.vivo',
        dl_page: 'vue3',
      }
    })
  }
}
