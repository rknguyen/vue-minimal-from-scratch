import compiler from '../compiler'
import { installRenderHelpers } from './render-helpers'

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
  if (vm.$options.el) {
    vm.$el = vm.$options.el
    vm.$container = document.querySelector(vm.$el)
    vm.$template = vm.$container.outerHTML
  }

  vm._c = createElement

  vm._render = () => compiler.compileToFunctions(vm.$template).render

  vm._update = () => {
    const newVNode = vm._render().apply(vm)
    if (vm.$vnode === null) {
      patch(vm.$container, newVNode)
    } else {
      patch(vm.$vnode, newVNode)
    }
    vm.$vnode = newVNode
  }
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype)
}
