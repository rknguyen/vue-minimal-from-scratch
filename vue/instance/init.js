import { initState } from './state'
import { initRender } from './render'
import { useEffect } from '../observer/dep'
import { callHook } from './hook'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    initRender(vm)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')

    useEffect(vm._update.bind(vm))
  }
}
