module TodoList.Feature (TodoListFeature, createTodoListFeature) where

import Common.Model exposing (Todo)
import Library.Util exposing (broadcast)
import StartApp exposing (App, start)
import TodoList.Action exposing (Action)
import TodoList.Model exposing (Model)
import TodoList.Service exposing (loadTodos, deleteTodo)
import TodoList.Update exposing (initialModelAndEffects, update)
import TodoList.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  , outputs :
      { onEditTodo : List (Signal.Address Todo)
      , onUpdatedList : List (Signal.Address (List Todo))
      }
  }


type alias TodoListFeature =
  App Model


createTodoListFeature : Config -> TodoListFeature
createTodoListFeature config =
  start
    { init = initialModelAndEffects
    , update =
        update
          { loadTodos = loadTodos
          , deleteTodo = deleteTodo
          , signalEditTodo = broadcast config.outputs.onEditTodo
          , signalUpdatedList = broadcast config.outputs.onUpdatedList
          }
    , view = view
    , inputs = config.inputs
    }

