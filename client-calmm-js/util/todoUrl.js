const todoUrl = {
  get: "/todoList",
  save: "/saveTodo",
  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

export default todoUrl;
