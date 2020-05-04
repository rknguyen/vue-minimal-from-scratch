import { Dep } from './dep'

export function defineReactiveData(vm) {
  Object.keys(vm.$data).forEach((key) => {
    let dep = new Dep()
    defineProxy(vm, key, dep)
  })
}

export function defineProxy(vm, key, dep) {
  Object.defineProperty(vm, key, {
    get: function reactiveGetter() {
      dep.depend()
      return vm.$data[key]
    },
    set: function reactiveSetter(_value) {
      vm.$data[key] = _value
      dep.notify()
    },
  })
}
