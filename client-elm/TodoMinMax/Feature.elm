module TodoMinMax.Feature (createTodoMinMaxFeature) where

import Effects exposing (Effects)
import StartApp exposing (App, start)
import TodoMinMax.Action exposing (Action)
import TodoMinMax.Model exposing (Model)
import TodoMinMax.Update exposing (update)
import TodoMinMax.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  }


createTodoMinMaxFeature : Config -> App Model
createTodoMinMaxFeature config =
  start
    { init = ( { todos = [] }, Effects.none )
    , update = update
    , view = view
    , inputs = config.inputs
    }

