module Main where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.Feature exposing (model, todoListFeature, runLoadTodosTask)


main : Signal Html
main =
  todoListFeature


port portRunLoadTodos : Signal (Task Http.Error ())
port portRunLoadTodos =
  runLoadTodosTask

