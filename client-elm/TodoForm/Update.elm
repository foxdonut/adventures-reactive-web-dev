module TodoForm.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Task exposing (Task)
import TodoForm.Action exposing (Action(NoOp, Edit, ClearForm, Save, Saved))
import TodoForm.Model exposing (Model, initialModel)
--import Debug exposing (watch, watchSummary)


type alias Services =
  { saveTodo : Todo -> Task Never (Maybe Todo)
  , signalSaveTodo : Maybe Todo -> Action -> Effects Action
  }


initialModelAndEffects : ( Model, Effects Action )
initialModelAndEffects =
  ( initialModel
  , Effects.none
  )


update : Services -> Action -> Model -> ( Model, Effects Action )
update services action model =
{--
  let
    foo = watchSummary "model" toString model
  in
--}
    case action of
      NoOp ->
        ( model, Effects.none )

      Edit todo ->
        ( { todo = todo }, Effects.none )

      ClearForm ->
        initialModelAndEffects

      Save todo ->
        ( model, Effects.task (services.saveTodo todo) |> Effects.map Saved )

      Saved maybeTodo ->
        ( model, services.signalSaveTodo maybeTodo ClearForm )

