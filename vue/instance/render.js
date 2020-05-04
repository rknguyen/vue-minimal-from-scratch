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

  let $componentInstance = {}
  let $onRenderComponentCount = {}

  const createElement = (sel, data, children) => {
    if (vm.$components && Object.keys(vm.$components).includes(sel)) {
      if (vm.$vnode) {
        $onRenderComponentCount[sel] = $onRenderComponentCount[sel] + 1 || 0
        $onRenderComponentCount[sel] %= $componentInstance[sel].length
        return $componentInstance[sel][$onRenderComponentCount[sel]].$vnode
      } else {
        if (!$componentInstance[sel]) {
          $componentInstance[sel] = []
        }
        const componentOptions = cloneDeep(vm.$components[sel])
        let instance = new Vue(componentOptions)
        $componentInstance[sel].push(instance)
        return $componentInstance[sel][$componentInstance[sel].length - 1].$vnode
      }
    } else {
      if (Array.isArray(data)) {
        return _createElement(sel, {}, data)
      } else if (typeof data === 'object') {
        if (Array.isArray(children)) {
          return _createElement(sel, data, children)
        } else {
          return _createElement(sel, data)
        }
      } else {
        return _createElement(sel)
      }
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
    // console.log(vm._render, newVNode)
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
