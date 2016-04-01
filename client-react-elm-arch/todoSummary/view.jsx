import React from "react";
import {map, pipe, pluck, prop, sum} from "ramda";

const view = _actions => model => {
  const todos = model.todos;
  const totalTodos = todos.length;
  const totalPriority = pipe(pluck("priority"), map(parseInt), sum);
  const averagePriority = totalPriority(todos) / totalTodos;
  const lastPriority = model.lastSaved.map(prop("priority")).getOrElse(0);

  return (
    <div>
      <span>
        Total todos: {totalTodos}{' '}
        Average priority: {averagePriority}{' '}
        Last priority: {lastPriority}
      </span>
    </div>
  );
};

export { view };
