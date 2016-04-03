module Main (..) where

import Common.Model exposing (Todo)
import TodoMain exposing (createTodoMainFeature)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)


port saveTodo : Signal (Maybe Todo)


todoMainFeature = createTodoMainFeature saveTodo


main : Signal Html
main =
  todoMainFeature.html


port tasks : Signal (Task Never ())
port tasks =
  todoMainFeature.tasks


port editTodo : Signal Todo
port editTodo =
  todoMainFeature.editTodoSignal
