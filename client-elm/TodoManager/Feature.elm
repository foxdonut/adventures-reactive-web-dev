module TodoManager.Feature (TodoManagerFeature, createTodoManagerFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (TodoFormFeature, createTodoFormFeature)
import TodoList.Action exposing (Action(ShowList, UpdateList))
import TodoList.Feature exposing (TodoListFeature, createTodoListFeature)
import TodoList.Model exposing (initialModel)
import TodoManager.View exposing (view)
import TodoSummary.Action exposing (Action(Update, LastSaved))
import TodoSummary.Feature exposing (TodoSummaryFeature, createTodoSummaryFeature)


type alias Config =
  { inputs : List (Signal.Signal TodoList.Action.Action)
  , outputs :
      { onUpdatedList : List (Signal.Address (List Todo))
      , onSaveTodo : List (Signal.Address (Maybe Todo))
      , onEditTodo : List (Signal.Address Todo)
      }
  }


type alias TodoManagerFeature =
  { html : Signal Html
  , tasks : Signal (Task Never ())
  }


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList initialModel)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


makeTodoListFeature : Config -> TodoListFeature
makeTodoListFeature config =
  createTodoListFeature
    { inputs = todoListMailbox.signal :: config.inputs
    , outputs =
        { onEditTodo = Signal.forwardTo todoFormMailbox.address Edit :: config.outputs.onEditTodo
        , onUpdatedList = Signal.forwardTo todoSummaryMailbox.address Update :: config.outputs.onUpdatedList
        }
    }


makeTodoFormFeature : Config -> TodoFormFeature
makeTodoFormFeature config =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            List.append
              [ Signal.forwardTo todoListMailbox.address UpdateList
              , Signal.forwardTo todoSummaryMailbox.address LastSaved
              ]
              config.outputs.onSaveTodo
        }
    }


makeTodoSummaryFeature : Config -> TodoSummaryFeature
makeTodoSummaryFeature config =
  createTodoSummaryFeature { inputs = [ todoSummaryMailbox.signal ] }


makeHtml : TodoListFeature -> TodoFormFeature -> TodoSummaryFeature -> Signal Html
makeHtml todoListFeature todoFormFeature todoSummaryFeature =
  Signal.map2 view todoListFeature.html todoSummaryFeature.html


makeTasks : TodoListFeature -> TodoFormFeature -> TodoSummaryFeature -> Signal (Task Never ())
makeTasks todoListFeature todoFormFeature todoSummaryFeature =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoFormFeature.tasks
    , todoSummaryFeature.tasks
    ]


createTodoManagerFeature : Config -> TodoManagerFeature
createTodoManagerFeature config =
  let
    todoListFeature =
      makeTodoListFeature config

    todoFormFeature =
      makeTodoFormFeature config

    todoSummaryFeature =
      makeTodoSummaryFeature config

    html =
      makeHtml todoListFeature todoFormFeature todoSummaryFeature

    tasks =
      makeTasks todoListFeature todoFormFeature todoSummaryFeature
  in
    { html = html
    , tasks = tasks
    }

