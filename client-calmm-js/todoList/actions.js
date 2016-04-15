import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    loadTodos: createAction("ACTION_LIST", function() {
      return {
        promise: ajax.getJSON(todoUrl.get)
      };
    }),

    deleteTodo: createAction("ACTION_DELETE", function(todo) {
      return {
        promise: ajax.deleteJSON(todoUrl.delete(todo.id))
      }
    }),

    editTodo: createAction("ACTION_EDIT")
  };
};

export default actions;
