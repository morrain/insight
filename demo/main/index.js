import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from '../../es';
import './index.less';

import update from  './load' // 加载手动加载卡片的 demo
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
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      app => {
        console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
        update(app.name)
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

const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: 'morrain',
});

onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

setGlobalState({
  ignore: 'master',
  user: {
    name: 'master',
  },
});

/**
 * Step3 设置默认进入的子应用
 */
setDefaultMountApp('/vue3');    

/**
 * Step4 启动应用
 */
start({
  prefetch: ['purehtml'] // 预加载 purehtml
});

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});
