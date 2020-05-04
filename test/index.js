import Vue from '../vue/index'

const buttonCounter = {
  data: {
    count: 0,
  },
  template: `<button @click="count += 1">You clicked me {{ count }} times.</button>`,
}

const clickedPanel = {
  data: {
    count: 0,
  },
  template: `<div>
    You clicked {{ count }} times 
    <button @click="count += 1">+1</button>
    <button-counter></button-counter>
  </div>`,
  components: {
    'button-counter': buttonCounter,
  },
}

var vm = new Vue({
  el: '#app',
  components: {
    'button-counter': buttonCounter,
    'clicked-pane': clickedPanel,
  },
})
