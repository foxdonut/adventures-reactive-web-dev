import Task from "data.task";
import { Just, Nothing } from "data.maybe";
import { futurizeP } from "futurize";
import { always } from "ramda";

import ajax from "../util/ajax-axios";
import todoUrl from "../util/todoUrl";

const toTask = f => futurizeP(Task)(f)();

// saveTodoHttp : Todo -> Task Http.Error Todo
const saveTodoHttp = todo => toTask(() => ajax.postJSON(todoUrl.save, todo));

// nothingTask : Http.Error -> Task Never (Maybe Number)
const nothingTask = always(Task.of(Nothing()));

// saveTodo : Todo -> Task Never (Maybe Todo)
const saveTodo = todo =>
  saveTodoHttp(todo).map(Just).orElse(nothingTask);

export { saveTodo };
