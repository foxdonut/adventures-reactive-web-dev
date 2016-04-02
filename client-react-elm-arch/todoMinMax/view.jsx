import React from "react";
import {map, max, min, pipe, pluck, reduce} from "ramda";

const view = _actions => model => {
  const todos = model.todos;
  const priorities = pipe(pluck("priority"), map(parseInt))(todos);
  const highestPriority = reduce(min, 100, priorities);
  const lowestPriority = reduce(max, 0,  priorities);

  return (
    <div>
      <span>
        Highest priority: {highestPriority}{' '}
        Lowest priority: {lowestPriority}
      </span>
    </div>
  );
};

export { view };
