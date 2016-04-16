import { broadcast, createFeature } from "meiosis";
import { initialModel } from "./model";
import { saveTodo } from "./service";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoFormFeature = config => {
  const services = {
    saveTodo,
    signalSaveTodo: broadcast(config.outputs.onSaveTodo)
  };
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [initialModel, null],
    update: update(services),
    view: view
  };

  return createFeature(featureConfig);
};

export { createTodoFormFeature };
