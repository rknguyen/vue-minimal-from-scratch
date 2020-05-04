import Vue from '../vue/index'

var vm = new Vue({
  el: '#app',
  data: {
    count: 0,
  },
  beforeCreate: function () {
    console.log('before create')
  },
  created: function () {
    console.log(this.count)
    console.log('created')
  },
  beforeMount: function () {
    console.log('before mount')
  },
  mounted: function () {
    console.log('mounted')
  },
  beforeUpdate: function () {
    console.log('before update')
  },
  updated: function () {
    console.log('updated')
  },
})
