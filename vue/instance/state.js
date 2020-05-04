import { defineReactiveData } from '../observer/index'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  vm.$data = data

  defineReactiveData(vm)
}
