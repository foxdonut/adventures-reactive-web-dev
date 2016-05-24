# Creating a Feature

_Note: this is Part 1 of "Composing Features and Behaviours in the Elm Architecture". See the
[Introduction](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
for an overview and the table of contents._

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests, are welcome.

If you enjoy this article, consider [tweeting](https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&text=Composing%20Features%20and%20Behaviours%20in%20the%20Elm%20Architecture&tw_p=tweetbutton&url=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&via=foxdonut00) it to your followers.

## Feature Structure

Let's begin by looking at the directory and file structure for creating a feature. When I say
_feature_, I mean a section of a page, a part of an application, and so on. Feel free to use a
different name. I chose _feature_ simply because terms such as _component_ and _module_ are already
overloaded and used to mean different things to different people, languages, frameworks, and
libraries.

That being said, here are the files for the `TodoList` feature:

```
TodoList/
  Action.elm
  Feature.elm
  Model.elm
  Service.elm
  Update.elm
  View.elm
```

Putting all the files relating to a feature in a separate directory makes it easy to find the code
for a feature. To keep things neatly decoupled, our goal is to have no `import` statements for
another feature.

Of course, some of the code will need to be shared by several features. For that, let's use
`Common`.

## Common.Model

We'll start with a model for our todos. Since this will be used throughout the application, `Todo`
is defined in the `Common.Model` module:

[Common/Model.elm](Common/Model.elm)
```elm
module Common.Model (Todo, blankTodo) where


type alias Todo =
  { id : Int
  , priority : Int
  , description : String
  }


blankTodo : Todo
blankTodo =
  { id = 0
  , priority = 0
  , description = ""
  }
```

A `Todo` has an id, a priority, and a description. For convenience, we also have a `blankTodo`
instance defined here.

## TodoList.Model

Next, let's define the model for our `TodoList` feature:

[TodoList/Model.elm](TodoList/Model.elm)
```elm
type alias Model =
  { todos : List Todo
  , message : String
  }


initialModel : Model
initialModel =
  { todos = []
  , message = "Initializing..."
  }
```

The model includes the list of todos, and a `message` that we can use to display status text.

## TodoList.Action

Here are the actions that we have for `TodoList`:

[TodoList/Action.elm](TodoList/Action.elm)
```elm
type Action
  = NoOp
  | LoadList
  | ShowList Model
  | UpdateList (Maybe Todo)
  | EditTodo Todo
  | DeleteTodo Int
  | DeletedTodo (Maybe Int)
```

Our initial todo list is empty, and we'll have a button to request the list from the server. This
will trigger the `LoadList` action. Once obtained, `ShowList` is used to display the list in the
view. When a todo has been added or changed, `UpdateList` indicates that the list needs updating.

The list of todos is displayed in a table, one todo per row, each with an `Edit` button and a
`Delete` button. These trigger the `EditTodo` and `DeleteTodo` actions, respectively. The `EditTodo`
action notifies listeners, but doesn't have any effect on the `TodoList` feature itself.
`DeleteTodo`, on the other hand, has the effect of sending a delete request to the server. Once that
has completed, the `DeletedTodo` action is triggered so that the todo can be deleted from the list.

## TodoList.View

Here is the code that renders the todo list:

[TodoList/View.elm](TodoList/View.elm)
```elm
renderTodo : Signal.Address Action -> Todo -> Html
renderTodo address todo =
  tr
    []
    [ td [] [ todo.priority |> toString |> text ]
    , td [] [ todo.description |> text ]
    , td
        []
        [ button
            [ class "btn btn-primary btn-xs"
            , onClick address (EditTodo todo)
            ]
            [ text "Edit" ]
        , span [] [ text " " ]
        , button
            [ class "btn btn-danger btn-xs"
            , onClick address (DeleteTodo (.id todo))
            ]
            [ text "Delete" ]
        ]
    ]


view : Signal.Address Action -> Model -> Html
view address model =
  div
    [ class "row" ]
    [ div
        [ class "col-md-8" ]
        [ div
            []
            [ button
                [ class "btn btn-primary btn-sm"
                , onClick address LoadList
                ]
                [ text "Load Todos" ]
            ]
        , div [] [ span [] [ text "Todo List: " ], span [] [ text model.message ] ]
        , table
            [ class "table" ]
            [ thead
                []
                [ tr
                    []
                    [ th [] [ text "Priority" ]
                    , th [] [ text "Description" ]
                    , th [] [ text "Action" ]
                    ]
                ]
            , tbody [] (List.map (renderTodo address) model.todos)
            ]
        ]
    ]
```

I mentioned that I assume you are familiar with the Elm architecture, and the code above should be
familiar. The view is rendered with `Html` functions. The `view` function receives an address to
which to send signals for triggering actions. The _Load Todos_, _Edit_, and _Delete_ buttons
respectively trigger the `LoadList`, `EditTodo`, and `DeleteTodo` actions.

## TodoList.Update

In `TodoList.Update` is where we handle actions and trigger any other actions that should occur.
These other actions are of two varieties:

1. Actions within the `TodoList` feature itself, handled by the `update` function, and
2. Signaling events to other features.

Two important principles to notice in `Update` are:

1. Actions can be triggered both within the `TodoList` feature and from outside. In the latter case,
the `TodoList` feature doesn't need to "know" about these other features.
2. Similarly, the `TodoList` feature signals events to outside features, but has no knowledge of
what those features are.

Put another way, the code within `TodoList/` has no `import` statements of any other feature
modules.

Still in the interest of keeping the code neatly decoupled, the `TodoList.Update` module defines the
_services_ that it needs, but _does not_ include the implementation. The services are defined in a
separate module, `TodoList.Services`, and passed in to `TodoList.Update` as a parameter. This makes
it easy to substitute one implementation of the services for another, and also facilitates testing.

Let's look at these services:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
type alias Services =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never (Maybe Int)
  , signalEditTodo : Todo -> Action -> Effects Action
  , signalUpdatedList : List Todo -> Action -> Effects Action
  }
```

`TodoList.Update` needs to know how to load the list of todos from the server, and how to send a
request to the server to delete a todo. As outgoing signals, the `TodoList` feature notifies
listeners when a todo needs to be edited (when the user clicks on an `Edit` button), and when the
list has been updated.

The `update` function takes an implementation of these services as a parameter:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
update : Services -> Action -> Model -> ( Model, Effects Action )
```

With partial function application, passing in the `Services` implementation will return a function
that follows the signature of the standard `update` function in the Elm architecture, suitable for
passing to `StartApp.start`.

Let's look at some of the implementation of the `update` function:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
update services action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    LoadList ->
      ( { todos = []
        , message = "Loading, please wait..."
        }
      , Effects.task (services.loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      ( list, services.signalUpdatedList list.todos NoOp )
```

When the user presses on the _Load Todos_ button, that triggers the `LoadList` action. The model
shows a "please wait" message to the user and launches the task of loading the todos from the
server. When that resolves, the result is passed on to the `ShowList` action. That, in turn, returns
the list in the model, and triggers the task of signaling the updated list to listeners. Finally the
chain of action ends with `NoOp`.

Here is the rest of the `update` function:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
UpdateList maybeTodo ->
  let
    updatedModel =
      updateModelFromTodo model maybeTodo
  in
    ( updatedModel, actionEffect (ShowList updatedModel) )

EditTodo todo ->
  ( model, services.signalEditTodo todo NoOp )

DeleteTodo todoId ->
  ( { model | message = "Deleting, please wait..." }
  , Effects.task (services.deleteTodo todoId) |> Effects.map DeletedTodo
  )

DeletedTodo maybeTodoId ->
  case maybeTodoId of
    Just todoId ->
      let
        updatedModel =
          updateModelFromId model todoId
      in
        ( updatedModel, actionEffect (ShowList updatedModel) )

    Nothing ->
      ( { model | message = "An error occured when deleting a Todo." }, Effects.none )

```

Notice the `UpdateList` case. This action is triggered from _outside_ of the `TodoList` feature, to
notify that the list needs to updated with the passed-in todo. Later, this will be triggered from
the `TodoForm` feature when the user saves a todo. Now, to handle this action, we update the model
and trigger the `ShowList` action. Since the model that we return contains the updated list, why the
need to trigger `ShowList`? Because that action handle notifies outside listeners! We keep that
logic in one place and reuse it from other actions by triggering the `ShowList` action. Finally,
notice the `actionEffect` function: that is a convenience function that we'll look at shortly, along
with other convenience utilities.

## TodoList.Service

The tasks for interacting with the server are defined in a separate module, `TodoList.Service`. Not
being the focus of this article, I won't go into the implementation details, but of course you can
go ahead and look at the source code. The takeaway here is the separation of the implementation from
the `TodoList.Update` module.

`TodoList.Service` defines functions that return tasks for loading the todos and deleting a todo:

[TodoList/Service.elm](TodoList/Service.elm)
```elm
loadTodos : Task Never Model
loadTodos = -- ...


deleteTodo : Int -> Task Never (Maybe Int)
deleteTodo = -- ...
```

Now, let's look at the aforementioned `actionEffect` function and another useful function,
`broadcast`.

## Library.Util

Because the functions we will look at now are general-purpose functions, not specific to the
application, we'll define them in the `Library.Util` module:

[Library/Util.elm](Library/Util.elm)
```elm
actionEffect : a -> Effects a
actionEffect action =
  Effects.task (succeed action)


broadcast : List (Signal.Address d) -> d -> a -> Effects a
broadcast outputs data action =
  (List.map ((flip Signal.send) data) outputs)
    |> (List.map Effects.task)
    |> Effects.batch
    |> Effects.map (always action)
```

The first function, `actionEffect`, takes an action and returns an effect that triggers the action.
This is useful to trigger an action from another action within the `update` function. For example,
earlier we handled `UpdateList` by updating the model and then triggering the `ShowList` action.

We use the second function, `broadcast`, to notify listeners of an event. The function takes a list
of addresses so that we can notify multiple listeners. The next parameters are the data and the
action to trigger. The data is sent to the listeners, and the action is triggered as a result of the
effect returned from the `update` function.

## TodoList.Feature

We're now ready to put everything together. We use the `TodoList.Feature` for assembling the
feature, and expose a `createTodoListFeature` function to outer modules so that they can create the
feature.

[TodoList/Feature.elm](TodoList/Feature.elm)
```elm
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
```

In the feature's `Config`, we define the inputs and outputs. The inputs are always a list of
signals of the feature's actions, and they are passed through directly to the `inputs` of the
`StartApp.start` function. The outputs are the events that this feature emits to notify other
features. For `TodoList.Feature`, these outputs notify when the user wants to edit a todo, and
when the list of todos has been updated. Each output is a list of addresses to which to emit a
signal. Because it is a _list_ of addresses, _multiple_ listeners can register and be notified of
these events.

The `createTodoListFeature` function takes the config as a parameter and creates the feature in the
form of a `StartApp.App`. The parameters `init`, `view`, and `inputs` passed to `StartApp.start`
are the same as what you have already seen with `StartApp`.

The `update` parameter is more sophisticated. It has the particularity of passing in the
implementation of the services. For `loadTodos` and `deleteTodo`, these are the implementations
that we defined in `TodoList.Service`. For `signalEditTodo` and `signalUpdatedList`, we use the
`broadcast` function from `Library.Util` to send signals to the outputs that were passed in via
the `config` parameter.

The result is a standard `App`. Next, we'll wire the feature together in `TodoMain`, which we'll
use in the top-level `Main` module.

## TodoMain

We'll put together the app in `TodoMain`:

[TodoMain.elm](TodoMain.elm)
```elm
todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


todoListFeature : App TodoList.Model.Model
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = []
        , onUpdatedList = []
        }
    }


todoMainView : Html -> Html
todoMainView todoListView =
  div
    []
    [ todoListView
    ]


html : Signal Html
html =
  Signal.map todoMainView todoListFeature.html


tasks : Signal (Task Never ())
tasks =
  Signal.mergeMany
    [ todoListFeature.tasks
    ]


todoMainFeature =
  { html = html
  , tasks = tasks
  }
```

This is where we wire everything together. Because we only have the `TodoList` feature so far,
these wirings are mostly empty! We'll be filling them out in the next section.

The important thing to notice at this point is how `todoMainFeature` returns the `html` and
`tasks` for the top-level `Main` to use. For now, these are just those from the `TodoList` feature,
but again, this will become a combination when we add more features.

## Main

Our top-level `Main` is dead simple:

[Main.elm](Main.elm)
```elm
main : Signal Html
main =
  todoMainFeature.html


port tasks : Signal (Task Never ())
port tasks =
  todoMainFeature.tasks
```

We're just using the `html` as `main` and defining a `port` for the `tasks`. Our application is now
ready to run! When we click on the _Load Todos_ button, the list is retrieved from the server and
displayed in the table:

<img src="images/todo-example-01.gif" width="400"/>

We have created a feature with neatly separate files within a directory, and have written some
utility functions so that we can broadcast events to other features as well as listen to events from
them. In  
[Part 2](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-020-todoform-feature/client-elm#connecting-features-together)
we will add a new feature and see how we connect the two features together without either one
importing anything from the other.

