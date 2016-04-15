import {handleActions} from "redux-actions";

const initialState = {todos: []};

const pendingAction = () => ({inProgress: true, todos: []});
const listAction = (state, action) => ({inProgress: false, todos: action.payload});

export default handleActions({
  "ACTION_LIST_PENDING": pendingAction,
  "ACTION_LIST_FULFILLED": listAction,

  "ACTION_DELETE_PENDING": pendingAction,
  "ACTION_DELETE_FULFILLED": listAction,

  "ACTION_SAVE_PENDING": pendingAction,
  "ACTION_SAVE_FULFILLED": listAction
}, initialState);

