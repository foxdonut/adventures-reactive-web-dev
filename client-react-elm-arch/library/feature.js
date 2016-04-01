/*
Config action model =
  { inputs : List (action$)
  , initialModel : [ model, Task action ]
  , update : action -> model -> [ model, Task action ]
  , view : Address action -> model -> Html
  }

Feature =
  { view$ : Html$
  , taskRunner : (Task Never ())$
  }
*/
import { BehaviorSubject } from "rxjs/subject/BehaviorSubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import Task from "data.task";
import { identity, prop } from "ramda";

const createFeature = config => {
  // action$ : Subject<Action>
  const action$ = new BehaviorSubject(null);

  // mergedAction$ : Observable<Action>
  let mergedAction$ = action$;

  config.inputs.forEach(input$ => {
    mergedAction$ = mergedAction$.merge(input$);
  });

  // update : [ Model, Task Action ] -> Action -> [ Model, Task Action ]
  const update = (modelAndTask, action) => action ?
    config.update(action)(modelAndTask[0]) : modelAndTask;

  // modelAndTask$ : Observable<[Model, Task Action]>
  const modelAndTask$ = mergedAction$.scan(update, config.initialModel).publishReplay(1).refCount();

  // model$ : Observable<Model>
  const model$ = modelAndTask$.map(prop(0));

  // view$ : Observable<Html>
  const view$ = model$.map(config.view(action$));

  // sendAction : Action -> Task Never ()
  const sendAction = action => new Task((rej, res) => res(action$.next(action)));

  // taskRunner$ : Observable<Task Never ()>
  const task$ = modelAndTask$.map(modelAndTask =>
    modelAndTask[1] ? modelAndTask[1].chain(sendAction) : Task.of(null));

  const result = {
    view$,
    task$
  };

  return result;
};

const taskRunner = task => task.fork(identity, identity);

export { createFeature, taskRunner };
