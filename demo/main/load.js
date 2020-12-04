/**
 * 手动加载微服务
 */

import { loadMicroApp } from '../../es';

/**
 * Step1 加载卡片
 */
const cardInstance = loadMicroApp({
    name: 'gamecard',
    entry: '//localhost:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
    container: '#gamecard-container',
    props:{
      moduleId: 184,
      origin: 'demo'
    }
},{
  sandbox: false
})
/**
 * Step4 启动应用
 */

 export default function update (name){
   if (cardInstance && cardInstance.getStatus() === 'MOUNTED'){
     if(name=== 'vue'){
       cardInstance.update({
         moduleId: 187,
         origin: name
       })
     }else if(name === 'vue3'){
      cardInstance.update({
        moduleId: 184,
        origin: name
      })
     }else if(name === 'purehtml'){
      cardInstance.update({
        moduleId: 186,
        origin: name
      })
     }
   }
 }

