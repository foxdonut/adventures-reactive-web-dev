import { append, assoc, complement, filter, findIndex, lensIndex, propEq, set } from "ramda";
import Task from "data.task";

import { Action } from "./action";

// updateTodos : List Todo -> Todo -> List Todo
const updateTodos = todos => todo => {
  const index = findIndex(propEq("id", todo.id), todos);
  return (index >= 0) ?
    set(lensIndex(index), todo, todos) : append(todo, todos);
};

// updateModelFromTodo : Model -> Maybe Todo -> Model
const updateModelFromTodo = model => maybeTodo =>
  maybeTodo
  .map(todo => updateTodos(model.todos)(todo))
  .map(todos => ({ todos, message: "" }))
  .getOrElse(assoc("message", "Sorry, an error occurred.", model));

// handler : Model -> [ model, Maybe (Task Action) ]
const handler = services => model => ({
  NoOp: () => [model, null],

  LoadList: () => [
    { todos: model.todos, message: "Loading, please wait..." },
    services.loadTodos.map(Action.ShowList)
  ],

  ShowList: list => [list, services.signalUpdatedList(list.todos)(Action.NoOp())],

  UpdateList: maybeTodo => [model, Task.of(Action.ShowList(updateModelFromTodo(model)(maybeTodo)))],

  EditTodo: todo => [model, services.signalEditTodo(todo)(Action.NoOp())],

  DeleteTodo: todoId => [
    { todos: model.todos, message: "Deleting, please wait..." },
    services.deleteTodo(todoId).map(Action.DeletedTodo)
  ],

  DeletedTodo: maybeTodoId => {
    const updatedModel =
      maybeTodoId
      .map(todoId => ({ todos: filter(complement(propEq("id", todoId)), model.todos), message: "" }))
      .getOrElse({ todos: model.todos, message: "An error occured when deleting a Todo." });

    return [updatedModel, Task.of(Action.ShowList(updatedModel))];
  }
});

// update : Services -> Model -> Action -> [ model, Maybe (Task Action) ]
const update = services => (model, action) => Action.case(handler(services)(model), action);

export { update };
