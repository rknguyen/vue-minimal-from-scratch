import compiler from '../compiler'
import { installRenderHelpers } from './render-helpers'
import { callHook } from './hook'

import { Vue } from './index'
import { cloneDeep } from 'lodash'

const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
])

const _createElement = require('snabbdom/h').default

export function initRender(vm) {
  vm.$vnode = null
  vm.$template = ''

  if (vm.$options.components) {
    vm.$components = vm.$options.components
  }

  vm.$componentCount = {}
  vm.$componentInstance = {}
  vm.$onRenderComponentCount = {}

  const createElement = (sel, data, children) => {
    if (vm.$components && Object.keys(vm.$components).includes(sel)) {
      if (vm.$vnode) {
        vm.$onRenderComponentCount[sel] = vm.$onRenderComponentCount[sel] + 1 || 0
        vm.$onRenderComponentCount[sel] %= vm.$componentInstance[sel].length
        return vm.$componentInstance[sel][vm.$onRenderComponentCount[sel]].$vnode
      } else {
        if (!vm.$componentInstance[sel]) {
          vm.$componentInstance[sel] = []
        }
        const componentOptions = cloneDeep(vm.$components[sel])
        let instance = new Vue(componentOptions)
        vm.$componentInstance[sel].push(instance)
        return vm.$componentInstance[sel][vm.$componentInstance[sel].length - 1].$vnode
      }
    } else {
      return _createElement(sel, data, children)
    }
  }

  vm._c = createElement

  if (vm.$options.el) {
    vm.$el = vm.$options.el
    vm.$container = document.querySelector(vm.$el)
    vm.$template = vm.$container.outerHTML
  }

  if (vm.$options.template) {
    vm.$template = vm.$options.template
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
      if (vm.$el) {
        patch(vm.$container, newVNode)
      }
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
