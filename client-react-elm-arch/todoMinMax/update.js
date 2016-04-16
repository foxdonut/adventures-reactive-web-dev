import { assoc } from "ramda";
import { Action } from "./action";

// handler : Model -> [ model, Task Action ]
const handler = model => ({
  Update: todos => [assoc("todos", todos, model), null]
});

// update : Model -> Action -> [ model, Maybe (Task Action) ]
const update = (model, action) => Action.case(handler(model), action);

export { update };
