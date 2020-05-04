export class Dep {
  constructor() {
    this.subs = []
  }

  depend() {
    if (Dep.target && !this.subs.includes(Dep.target)) {
      this.subs.push(Dep.target)
    }
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; ++i) {
      subs[i].call()
    }
  }
}

Dep.target = null

export function useEffect(fn) {
  Dep.target = fn
  fn.call()
  Dep.target = null
}
