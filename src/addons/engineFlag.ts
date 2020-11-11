import { FrameworkLifeCycles } from '../interfaces'

export default function getAddOn(global: Window): FrameworkLifeCycles<any> {
  return {
    async beforeLoad() {
      // eslint-disable-next-line no-param-reassign
      global.__POWERED_BY_INSIGHT__ = true
    },

    async beforeMount() {
      // eslint-disable-next-line no-param-reassign
      global.__POWERED_BY_INSIGHT__ = true
    },

    async beforeUnmount() {
      // eslint-disable-next-line no-param-reassign
      delete global.__POWERED_BY_INSIGHT__
    }
  }
}
