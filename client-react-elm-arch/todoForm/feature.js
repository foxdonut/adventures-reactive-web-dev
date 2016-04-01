import { createFeature } from "../library/feature";
import { broadcast } from "../library/broadcast";
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
