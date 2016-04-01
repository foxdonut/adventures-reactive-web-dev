import Type from "union-type";

const Action = Type({
  NoOp: [],
  LoadList: [],
  ShowList: [Object],
  UpdateList: [Object],
  EditTodo: [Object],
  DeleteTodo: [Number],
  DeletedTodo: [Object]
});

export { Action };
