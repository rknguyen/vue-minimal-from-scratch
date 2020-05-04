import { defineReactiveData } from '../observer/index'

export function initState(vm) {
  initData(vm)
}

function initData(vm) {
  let data = vm.$options.data
  vm.$data = data

  defineReactiveData(vm)
}
