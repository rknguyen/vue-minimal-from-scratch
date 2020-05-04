import { initState } from './state'
import { initRender } from './render'
import { useEffect } from '../observer/dep'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    initRender(vm)
    initState(vm)

    useEffect(vm._update.bind(vm))
  }
}
