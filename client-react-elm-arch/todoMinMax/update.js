import { assoc } from "ramda";
import { Action } from "./action";

// handler : Model -> [ model, Task Action ]
const handler = model => ({
  Update: todos => [assoc("todos", todos, model), null]
});

// update : Action -> Model -> [ model, Maybe (Task Action) ]
const update = action => model => Action.case(handler(model), action);

export { update };
