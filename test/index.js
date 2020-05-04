import Vue from '../vue/index'

const BlogPost = {
  props: ['title', 'author'],
  template: '<div><h3>{{ title }}</h3><h2>{{ author }}</h2></div>',
}

var vm = new Vue({
  el: '#app',
  components: {
    'blog-post': BlogPost,
  },
  data: {
    title: 'ABC',
  },
  mounted: function () {
    setTimeout(() => {
      this.title = 'RK Nguyen'
      console.log('2s')
    }, 2000)
  },
})
