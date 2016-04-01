import Type from "union-type";

const Action = Type({
  Update: [Array],
  LastSaved: [Object]
});

export { Action };
