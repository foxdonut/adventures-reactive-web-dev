import React from "react";
import {render} from "react-dom";
import Atom from "kefir.atom";

import TodoList from "./todoList/main";
//import TodoForm from "./todoForm/main";

//import ajax from "./util/ajax-axios";
//import todoUrl from "./util/todoUrl";

export default function(element) {
  const todos = [
    {id: 1, priority: 1, description: "item 1"},
    {id: 2, priority: 2, description: "item 2"}
  ];
  const model = Atom({todos:todos});

  render(
    <div>
      {/*<TodoForm/>*/}
      <TodoList {...{model}}/>
    </div>,
    element
  );

//store.dispatch(listActions.loadTodos());
}
