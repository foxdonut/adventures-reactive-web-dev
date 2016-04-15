import {handleActions} from "redux-actions";

const initialState = {todo: {}};
const returnTodo = (model, action) => ({todo: action.payload});
const returnBlank = () => ({todo: {}});

export default handleActions({
  "ACTION_EDIT": returnTodo,
  "redux-form/RESET": returnBlank
}, initialState);

