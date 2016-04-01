import Type from "union-type";

const Action = Type({
  NoOp: [],
  Edit: [Object],
  ClearForm: [],
  Save: [Object],
  Saved: [Object]
});

export { Action };
