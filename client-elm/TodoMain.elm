module TodoMain (createTodoMainFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import TodoManager.Feature exposing (TodoManagerFeature, createTodoManagerFeature)
import TodoMinMax.Action exposing (Action(Update))
import TodoMinMax.Feature exposing (TodoMinMaxFeature, createTodoMinMaxFeature)


todoMinMaxMailbox : Signal.Mailbox TodoMinMax.Action.Action
todoMinMaxMailbox =
  Signal.mailbox (Update [])


todoEditMailbox : Signal.Mailbox Todo
todoEditMailbox =
  Signal.mailbox blankTodo


todoMinMaxFeature : TodoMinMaxFeature
todoMinMaxFeature =
  createTodoMinMaxFeature { inputs = [ todoMinMaxMailbox.signal ] }


makeTodoManagerFeature : Signal (Maybe Todo) -> TodoManagerFeature
makeTodoManagerFeature saveTodoSignal =
  createTodoManagerFeature
    { inputs =
        { saveTodoSignal = saveTodoSignal }
    , outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onEditTodo = [ todoEditMailbox.address ]
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoManagerView todoMinMaxView =
  div
    []
    [ todoMinMaxView
    , todoManagerView
    ]


makeHtml : TodoManagerFeature -> TodoMinMaxFeature -> Signal Html
makeHtml todoManagerFeature todoMinMaxFeature =
  Signal.map2 todoMainView todoManagerFeature.html todoMinMaxFeature.html


makeTasks : TodoManagerFeature -> Signal (Task Never ())
makeTasks todoManagerFeature =
  todoManagerFeature.tasks


createTodoMainFeature saveTodoSignal =
  let
    todoManagerFeature =
      makeTodoManagerFeature saveTodoSignal

    html =
      makeHtml todoManagerFeature todoMinMaxFeature
  in
    { html = html
    , tasks = makeTasks todoManagerFeature
    , editTodoSignal = todoEditMailbox.signal
    }

