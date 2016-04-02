module TodoForm.Feature (TodoFormFeature, createTodoFormFeature) where

import Common.Model exposing (Todo)
import Library.Util exposing (broadcast)
import StartApp exposing (App, start)
import TodoForm.Action exposing (Action)
import TodoForm.Model exposing (Model)
import TodoForm.Service exposing (saveTodo)
import TodoForm.Update exposing (initialModelAndEffects, update)
import TodoForm.View exposing (view)


type alias Config =
  { inputs : List (Signal.Signal Action)
  , outputs :
      { onSaveTodo : List (Signal.Address (Maybe Todo))
      }
  }


type alias TodoFormFeature =
  App Model


createTodoFormFeature : Config -> TodoFormFeature
createTodoFormFeature config =
  start
    { init = initialModelAndEffects
    , update =
        update
          { saveTodo = saveTodo
          , signalSaveTodo = broadcast config.outputs.onSaveTodo
          }
    , view = view
    , inputs = config.inputs
    }

