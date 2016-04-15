import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";
import {reducer as formReducer} from "redux-form";

export default function(middleware, todoListReducer, todoFormReducer) {
  const reducer = combineReducers({list: todoListReducer, form: formReducer, todoForm: todoFormReducer});
  const createStoreWithMiddleware = middleware(createStore);
  const store = createStoreWithMiddleware(reducer);
  return store;
};
