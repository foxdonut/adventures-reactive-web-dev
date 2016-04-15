import React from "react";
import {render} from "react-dom";

import TodoList from "./todoList/main";
//import TodoForm from "./todoForm/main";

//import ajax from "./util/ajax-axios";
//import todoUrl from "./util/todoUrl";

export default function(element) {

  render(
    <div>
      {/*<TodoForm/>*/}
      <TodoList/>
    </div>,
    element
  );

//store.dispatch(listActions.loadTodos());
}
