module TodoManager.Feature (TodoManagerFeature, createTodoManagerFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)
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


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


makeTodoListFeature : Config -> TodoListFeature
makeTodoListFeature config =
  createTodoListFeature
    { inputs = todoListMailbox.signal :: config.inputs
    , outputs =
        { onEditTodo = config.outputs.onEditTodo
        , onUpdatedList = Signal.forwardTo todoSummaryMailbox.address Update :: config.outputs.onUpdatedList
        }
    }


makeTodoSummaryFeature : Config -> TodoSummaryFeature
makeTodoSummaryFeature config =
  createTodoSummaryFeature { inputs = [ todoSummaryMailbox.signal ] }


makeHtml : TodoListFeature -> TodoSummaryFeature -> Signal Html
makeHtml todoListFeature todoSummaryFeature =
  Signal.map2 view todoListFeature.html todoSummaryFeature.html


makeTasks : TodoListFeature -> TodoSummaryFeature -> Signal (Task Never ())
makeTasks todoListFeature todoSummaryFeature =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoSummaryFeature.tasks
    ]


createTodoManagerFeature : Config -> TodoManagerFeature
createTodoManagerFeature config =
  let
    todoListFeature =
      makeTodoListFeature config

    todoSummaryFeature =
      makeTodoSummaryFeature config

    html =
      makeHtml todoListFeature todoSummaryFeature

    tasks =
      makeTasks todoListFeature todoSummaryFeature
  in
    { html = html
    , tasks = tasks
    }

