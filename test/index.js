import Vue from '../vue/index'

const buttonCounter = {
  data: {
    count: 0,
  },
  template: `<button @click="count += 1">You clicked me {{ count }} times.</button>`,
}

var vm = new Vue({
  el: '#app',
  components: {
    'button-counter': buttonCounter,
  },
  data: {
    count: 0,
  },
})
