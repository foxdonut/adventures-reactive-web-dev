import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    saveTodo: createAction("ACTION_SAVE", function(form) {
      return {promise: ajax.postJSON(todoUrl.save, form)};
    })
  };
};

export default actions;
