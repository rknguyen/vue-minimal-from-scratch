import Vue from '../vue/index'

var todoApp = new Vue({
  el: '#todo',
  data: {
    newTodoText: '',
    todos: ['Eat', 'Sleep', 'Code'],
  },
  methods: {
    keyup: function (event) {
      if (event.code === 'Enter') {
        this.addNewTodo()
      }
    },
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    },
    remove: function (index) {
      const todos = this.todos
      todos.splice(index, 1)
      this.todos = todos
    },
  },
})
