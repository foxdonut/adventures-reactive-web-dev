import { createFeature } from "meiosis";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoMinMaxFeature = config => {
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [{todos: []}, null],
    update: update,
    view: view
  };

  return createFeature(featureConfig);
};

export { createTodoMinMaxFeature };
