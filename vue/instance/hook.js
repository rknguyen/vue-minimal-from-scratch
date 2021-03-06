export function callHook(vm, hook) {
  if (
    Object.prototype.hasOwnProperty.call(vm.$options, hook) &&
    typeof vm.$options[hook] === 'function'
  ) {
    vm.$options[hook].apply(vm)
  }
}
