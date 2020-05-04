import compiler from '../compiler'
import { installRenderHelpers } from './render-helpers'
import { callHook } from './hook'

const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
])

const createElement = require('snabbdom/h').default

export function initRender(vm) {
  vm.$vnode = null
  vm.$template = ''
  vm._c = createElement

  if (vm.$options.el) {
    vm.$el = vm.$options.el
    vm.$container = document.querySelector(vm.$el)

    if (vm.$options.template) {
      vm.$template = vm.$options.template
    } else {
      vm.$template = vm.$container.outerHTML
    }
  }

  if (vm.$options.render) {
    vm._render = vm.$options.render
  } else {
    vm._render = compiler.compileToFunctions(vm.$template).render
  }

  vm._update = () => {
    const newVNode = vm._render.call(vm, createElement)
    if (vm.$vnode === null) {
      callHook(vm, 'beforeMount')
      patch(vm.$container, newVNode)
      callHook(vm, 'mounted')
    } else {
      callHook(vm, 'beforeUpdate')
      patch(vm.$vnode, newVNode)
      callHook(vm, 'updated')
    }
    vm.$vnode = newVNode
  }
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype)
}
