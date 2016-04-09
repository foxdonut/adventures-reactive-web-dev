module Debug.Main (..) where

import TodoMain exposing (todoMainFeature)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)


main : Signal Html
main =
  todoMainFeature.html

{--
port tasks : Signal (Task Never ())
port tasks =
  todoMainFeature.tasks
--}
