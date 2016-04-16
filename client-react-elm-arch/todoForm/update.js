import { Action } from "./action";
import { initialModel } from "./model";

// handler : Model -> [ model, Maybe (Task Action) ]
const handler = services => model => ({
  NoOp: () => [model, null],

  Edit: todo => [{ todo: todo }, null],

  ClearForm: () => [initialModel, null],

  Save: todo => [model, services.saveTodo(todo).map(Action.Saved)],

  Saved: maybeTodo => [
    model,
    services.signalSaveTodo(maybeTodo)(Action.ClearForm())
  ]
});

// update : Services -> Model -> Action -> [ model, Maybe (Task Action) ]
const update = services => (model, action) => Action.case(handler(services)(model), action);

export { update };
