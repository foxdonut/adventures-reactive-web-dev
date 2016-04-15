import {applyMiddleware} from "redux";
import promiseMiddleware from "redux-promise-middleware";

import createStore from "./store";

export default function(todoListReducer, todoFormReducer) {
  const middleware = applyMiddleware(promiseMiddleware());
  return createStore(middleware, todoListReducer, todoFormReducer);
};
