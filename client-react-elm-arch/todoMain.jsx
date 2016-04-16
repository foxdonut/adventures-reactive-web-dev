import React from "react";
import { Subject } from "rx";
import { unary } from "ramda";

import { createTodoManagerFeature } from "./todoManager/feature";
import { createTodoMinMaxFeature } from "./todoMinMax/feature";

import { Action as MinMaxAction } from "./todoMinMax/action";

export default function() {
  const todoMinMaxMailbox = new Subject();

  const todoManagerFeature = createTodoManagerFeature(
    { outputs: { onUpdatedList: [todoMinMaxMailbox] }}
  );

  const todoMinMaxFeature = createTodoMinMaxFeature(
    { inputs: [todoMinMaxMailbox.map(unary(MinMaxAction.Update))] }
  );

  const view$ = todoManagerFeature.view$.combineLatest(todoMinMaxFeature.view$,
    (todoManagerView, todoMinMaxView) => (
      <div>
        {todoMinMaxView}
        {todoManagerView}
      </div>));

  const task$ = todoManagerFeature.task$;

  return { view$, task$ };
}
