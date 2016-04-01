import Task from "data.task";
import { Just, Nothing } from "data.maybe";
import { futurizeP } from "futurize";
import { always } from "ramda";

import ajax from "../util/ajax-axios";
import todoUrl from "../util/todoUrl";

const toTask = f => futurizeP(Task)(f)();

const intoModel = todos => ({ todos: todos, message: "" });

// loadTodosHttp : Task Http.Error Model
const loadTodosHttp = toTask(() => ajax.getJSON(todoUrl.get)).map(intoModel);

// deleteTodoHttp : Number -> Task Http.Error Number
const deleteTodoHttp = todoId =>
  toTask(() => ajax.deleteJSON(todoUrl.delete(todoId))).map(always(todoId));

// errorMessage : Http.Error -> Task Never Model
const errorMessage = always(Task.of({ todos: [], message: "An error occurred." }));

// loadTodos : Task Never Model
const loadTodos = loadTodosHttp.orElse(errorMessage);

// nothingTask : Http.Error -> Task Never (Maybe Number)
const nothingTask = always(Task.of(Nothing()));

// deleteTodo : Number -> Task Never (Maybe Number)
const deleteTodo = todoId =>
  deleteTodoHttp(todoId).map(Just).orElse(nothingTask);

export { loadTodos, deleteTodo };
