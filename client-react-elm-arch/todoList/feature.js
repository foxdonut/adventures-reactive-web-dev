import { createFeature, broadcast } from "meiosis";
import { initialModel } from "./model";
import { loadTodos, deleteTodo } from "./service";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoListFeature = config => {
  const services = {
    loadTodos,
    deleteTodo,
    signalEditTodo: broadcast(config.outputs.onEditTodo),
    signalUpdatedList: broadcast(config.outputs.onUpdatedList)
  };
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [initialModel, null],
    update: update(services),
    view: view
  };

  return createFeature(featureConfig);
};

export { createTodoListFeature };
