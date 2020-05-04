export function installRenderHelpers(target) {
  target._o = target._n = toNumber // markOnce
  target._s = toString
  target._l = renderList
  target._t = emptyFunction // renderSlot
  target._q = emptyFunction // looseEqual
  target._i = emptyFunction // looseIndexOf
  target._m = emptyFunction // renderStatic
  target._f = emptyFunction // resolveFilter
  target._k = emptyFunction // checkKeyCodes
  target._b = emptyFunction // bindObjectProps
  target._v = emptyFunction
  target._e = emptyFunction
  target._u = emptyFunction // resolveScopedSlots
  target._g = emptyFunction // bindObjectListeners
  target._d = emptyFunction // bindDynamicKeys
  target._p = emptyFunction // prependModifier
}

export const emptyFunction = (x) => x

export const toNumber = (x) => Number(x)

export const toString = (x) => {
  if (typeof x === 'object') return 'object'
  if (typeof x === 'function') return 'function'
  return x + ''
}

export const renderList = (items, transform) => {
  if (Array.isArray(items)) {
    return items.map((item, i) => transform(item, i))
  } else if (typeof items === 'number') {
    return new Array(items).fill(1).map((_, i) => transform(i + 1, i))
  } else if (typeof items === 'object') {
    return Object.keys(items).map((key, i) => transform(items[key], key, i))
  }
}
