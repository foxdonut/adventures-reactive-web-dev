module TodoMain (todoMainFeature) where

import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import TodoManager.Feature exposing (TodoManagerFeature, createTodoManagerFeature)
import TodoMinMax.Action exposing (Action(Update))
import TodoMinMax.Feature exposing (TodoMinMaxFeature, createTodoMinMaxFeature)


todoMinMaxMailbox : Signal.Mailbox TodoMinMax.Action.Action
todoMinMaxMailbox =
  Signal.mailbox (Update [])


todoMinMaxFeature : TodoMinMaxFeature
todoMinMaxFeature =
  createTodoMinMaxFeature { inputs = [ todoMinMaxMailbox.signal ] }


todoManagerFeature : TodoManagerFeature
todoManagerFeature =
  createTodoManagerFeature
    { outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onSaveTodo = []
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoManagerView todoMinMaxView =
  div
    []
    [ todoMinMaxView
    , todoManagerView
    ]


html : Signal Html
html =
  Signal.map2 todoMainView todoManagerFeature.html todoMinMaxFeature.html


tasks : Signal (Task Never ())
tasks =
  todoManagerFeature.tasks


todoMainFeature =
  { html = html
  , tasks = tasks
  }

