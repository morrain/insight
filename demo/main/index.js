import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState, getAppStatus, addErrorHandler, addGlobalUncaughtErrorHandler } from '../../es';
import './index.less';

import {loadCard1, loadCard2, update, unloadCard1, unloadCard2} from  './load' // 加载手动加载卡片的 demo
/**
 * 主应用 **可以使用任意技术栈**
 */
import render from './render/VueRender';

/**
 * Step1 初始化应用（可选）
 */
render({ loading: true });

const loader = loading => render({ loading });

/**
 * Step2 注册子应用
 */

registerMicroApps(
  [
    {
      name: 'vue',
      entry: '//localhost:7101',
      container: '#subapp-viewport',
      loader, // 开始加载时，回调参数 loading 为 true，表示开始加载，加载完成后再次调用该函数， loading值为 false 表示加载结束
      activeRule: '/vue',
    },
    {
      name: 'purehtml',
      entry: '//localhost:7102',
      container: '#subapp-viewport',
      loader,
      activeRule: '/purehtml',
    },
    {
      name: 'vue3',
      entry: '//localhost:7103',
      container: '#subapp-viewport',
      loader,
      activeRule: '/vue3',
    }
  ],
  {
    beforeLoad: [
      app => {
        // 获取当前应用的状态
        const status = getAppStatus(app.name)
        console.log('[LifeCycle] before load %c%s status:%s', 'color: green;', app.name, status);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      app => {
        // 获取当前应用的状态
        const status = getAppStatus(app.name)
        console.log('[LifeCycle] after mount %c%s status:%s', 'color: green;', app.name, status);
        if(app.name === 'vue'){
          loadCard1()
        }
        if(app.name === 'vue3'){
          loadCard2()
          update()
        }
        if(app.name === 'purehtml'){
          unloadCard1()
          unloadCard2()
        }
      },
    ],
    beforeUnmount: [
      app => {
        console.log('[LifeCycle] before unmount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
  },
);


 // 初始化 state
 const actions = initGlobalState({
  user: 'morrain',
  showCard: false
 })

 actions.onGlobalStateChange((value, prev) => {
   // value: 变更后的状态; prev 变更前的状态
   console.log('[onGlobalStateChange - master]:', value, prev)
 })
 actions.setGlobalState({
  ignore: 'master',
  user: {
    name: 'master',
  },
})
// actions.offGlobalStateChange() 微应用 umount 时会默认调用

/**
 * Step3 设置默认进入的子应用
 */
// setDefaultMountApp('/vue3');    

/**
 * Step4 启动应用
 */
start({
  prefetch: ['purehtml'] // 预加载 purehtml
});

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});


const hander = err => {
  console.log('err:', err)
  console.log(err.appOrParcelName)
  console.log(getAppStatus(err.appOrParcelName))
}

addErrorHandler(hander)
addGlobalUncaughtErrorHandler( event => {
  console.log('UncaughtError:promise', event.promise)
  console.log('UncaughtError:reason', event.reason)

  event.preventDefault()
})
