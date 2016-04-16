import { Subject } from "rx";
import { append, unary } from "ramda";

import { createTodoListFeature } from "../todoList/feature";
import { createTodoFormFeature } from "../todoForm/feature";
import { createTodoSummaryFeature } from "../todoSummary/feature";

import { Action as ListAction } from "../todoList/action";
import { Action as FormAction } from "../todoForm/action";
import { Action as SummaryAction } from "../todoSummary/action";

import { view } from "./view.jsx";

const createTodoManagerFeature = function(config) {
  const todoListMailbox = new Subject();
  const todoFormMailbox = new Subject();
  const todoSummaryUpdatedList = new Subject();
  const todoSummaryLastSaved = new Subject();

  const todoListFeature = createTodoListFeature({
    inputs: [todoListMailbox.map(unary(ListAction.UpdateList))],
    outputs: {
      onEditTodo: [todoFormMailbox],
      onUpdatedList: append(todoSummaryUpdatedList, config.outputs.onUpdatedList)
    }
  });

  const todoFormFeature = createTodoFormFeature({
    inputs: [todoFormMailbox.map(unary(FormAction.Edit))],
    outputs: { onSaveTodo: [todoListMailbox, todoSummaryLastSaved] }
  });

  const todoSummaryFeature = createTodoSummaryFeature({
    inputs: [
      todoSummaryUpdatedList.map(unary(SummaryAction.Update)),
      todoSummaryLastSaved.map(unary(SummaryAction.LastSaved))
    ]
  });

  const view$ = todoListFeature.view$.combineLatest(todoFormFeature.view$, todoSummaryFeature.view$, view);

  const task$ = todoListFeature.task$.merge(todoFormFeature.task$);

  return { view$, task$ };
};

export { createTodoManagerFeature };
