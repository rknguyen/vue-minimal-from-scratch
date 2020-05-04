import compiler from '../compiler'
import { installRenderHelpers } from './render-helpers'
import { callHook } from './hook'

import { Vue } from './index'
import { cloneDeep, intersection, merge } from 'lodash'

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

  if (vm.$options.props) {
    vm.$props = vm.$options.props
  }

  if (vm.$options.methods) {
    vm.$methods = vm.$options.methods
    Object.keys(vm.$methods).forEach((methodName) => {
      vm[methodName] = (...args) => vm.$methods[methodName].call(vm, ...args)
    })
  }

  vm.$componentInstance = {}
  vm.$onRenderComponentCount = {}

  const createElement = (sel, data, children) => {
    if (vm.$components && Object.keys(vm.$components).includes(sel)) {
      if (vm.$vnode) {
        vm.$onRenderComponentCount[sel] = vm.$onRenderComponentCount[sel] + 1 || 0
        vm.$onRenderComponentCount[sel] %= vm.$componentInstance[sel].length

        let instance = vm.$componentInstance[sel][vm.$onRenderComponentCount[sel]]

        if (typeof data === 'object') {
          if (data.attrs) {
            const props = intersection(Object.keys(data.attrs), instance.$props)
            for (let i = 0, l = props.length; i < l; ++i) {
              instance[props[i]] = data.attrs[props[i]]
            }
          }
        }

        return instance.$vnode
      } else {
        if (!vm.$componentInstance[sel]) {
          vm.$componentInstance[sel] = []
        }

        let componentOptions = cloneDeep(vm.$components[sel])

        if (typeof data === 'object') {
          if (data.attrs) {
            const props = intersection(Object.keys(data.attrs), componentOptions.props)
            const dataProps = {}
            for (let i = 0, l = props.length; i < l; ++i) {
              dataProps[props[i]] = data.attrs[props[i]]
            }
            componentOptions.data = merge(componentOptions.data, dataProps)
          }
        }

        let instance = new Vue(componentOptions)
        vm.$componentInstance[sel].push(instance)
        return vm.$componentInstance[sel][vm.$componentInstance[sel].length - 1].$vnode
      }
    } else {
      if (Array.isArray(data)) {
        return _createElement(sel, {}, data)
      } else if (typeof data === 'object') {
        handleDomProps(data)
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
    if (vm.$vnode === null) {
      callHook(vm, 'beforeMount')
      if (vm.$el) {
        patch(vm.$container, newVNode)
      }
      vm.$vnode = newVNode
      callHook(vm, 'mounted')
    } else {
      callHook(vm, 'beforeUpdate')
      patch(vm.$vnode, newVNode)
      vm.$vnode = newVNode
      callHook(vm, 'updated')
    }
  }
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype)
}

function handleDomProps(data) {
  data.props = {}
  if (data.domProps) {
    data.props = merge(data.props, data.domProps)
  }
  if (data.staticClass) {
    data.class = {}
    data.staticClass.split(' ').forEach((className) => {
      data.class[className] = true
    })
  }
  if (data.attrs) {
    if (data.attrs.id) {
      data.props.id = data.attrs.id
    }
  }
}
