import { Nothing } from "data.maybe";
import { createFeature } from "../library/feature";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoSummaryFeature = config => {
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [{todos: [], lastSaved: Nothing()}, null],
    update: update,
    view: view
  };

  return createFeature(featureConfig);
};

export { createTodoSummaryFeature };
