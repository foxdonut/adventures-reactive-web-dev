module TodoManager.View (view) where

import Html exposing (Html, div)
import Html.Attributes exposing (id)


view : Html -> Html -> Html
view todoListView todoSummaryView =
  div
    []
    [ div [ id "todoForm"] []
    , todoListView
    , todoSummaryView
    ]

