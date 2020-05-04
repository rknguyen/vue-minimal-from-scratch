import { initMixin } from './init'
import { renderMixin } from './render'

export function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
