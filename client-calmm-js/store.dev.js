import {applyMiddleware, compose} from "redux";
import promiseMiddleware from "redux-promise-middleware";

import createStore from "./store";

export default function(todoListReducer, todoFormReducer, DevTools) {
  const middleware = compose(
    applyMiddleware(promiseMiddleware()),
    DevTools.instrument());

  return createStore(middleware, todoListReducer, todoFormReducer);
};
