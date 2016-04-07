# Connecting With External JavaScript

_Note: this is Part 5 of "Composing Features and Behaviours in the Elm Architecture". See the
[Introduction](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
for an overview and the table of contents._

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests, are welcome.

In
[Part 4](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-040-todominmax-feature/client-elm#composing-features),
we grouped three features together into one. We connected that to another feature with signals and
addresses, and combined their views into the main view.

Now, let's consider the situation where we have external JavaScript code that we would like to
connect to our Elm application. We want two-way communication: that is, we want to send data from
the external JavaScript code into our Elm application, and from our Elm application back out to the
external JavaScript.

## Externalizing the TodoForm

For the purposes of this example, let's consider the scenario where the `TodoForm` is an external
JavaScript component. The rest of the application remains in Elm:

<img src="images/todomain_3.png"/>

Remember that the `TodoForm` listens to the `TodoList`'s _edit_ signal so that the form gets
populated when the users clicks on an _Edit_ button. That will need to be a signal from Elm to
external JavaScript. Going the other way, the `TodoForm` notifies listeners when a todo is _saved_.
Once we connect the signal from external JavaScript into Elm, we'll need to hook it up to the
`TodoList` and the `TodoSummary` so that they can update themselves.

## Rendering a Container Element

Whereas before, the view for `TodoManager` was the combination of the `TodoList`, `TodoForm`, and
`TodoSummary` views:

[TodoManager/View.elm](TodoManager/View.elm)
```elm
view todoListView todoFormView todoSummaryView =
  div
    []
    [ todoFormView
    , todoListView
    , todoSummaryView
    ]
```

Now, we'll just put a container `div` with an id for the `TodoForm`:

[TodoManager/View.elm](TodoManager/View.elm)
```elm
view todoListView todoSummaryView =
  div
    []
    [ div [ id "todoForm"] [] --<<----
    , todoListView
    , todoSummaryView
    ]
```

That will allow us to render an external JavaScript component within the view produced by our Elm
code.

## Rendering the TodoForm in JavaScript

Now that we have a container element in the view, let's render the TodoForm in it using the
following JavaScript code:

[app.js](app.js)
```javascript
var Elm = require("./Main.elm");
var elmApp = Elm.embed(Elm.Main, document.getElementById("app"));

var container = document.getElementById("todoForm");
container.innerHTML = "<div class='row'>" +
  // ...
  "<form>" +
  // ...
  "<input class='form-control' name='priority' id='priority'>" +
  // ...
  "<input class='form-control' name='description' id='description'>" +
  // ...
  "<button class='btn btn-primary btn-xs' id='save'>Save</button> " +
  "<button class='btn btn-danger btn-xs' id='cancel'>Cancel</button>" +
  // ...
```

That sure is an ugly way of constructing an HTML view! I am _not_ advocating this code as good
practice. There are other ways that are definitely better, but that is not the point of this
article. For the purposes of this example, we just want the form to be in JavaScript so that we can
see how we connect it to Elm.

## Connecting the Signals in JavaScript

Let's first connect the _edit_ signal coming out of our Elm app to the `TodoForm`, so that the form
will be populated when the user edits a todo from the `TodoList`.

[app.js](app.js)
```javascript
var $ = require("jquery");

var onEditTodo = function(todo) {
  $("#todoId").val(todo.id);
  $("#priority").val(todo.priority);
  $("#description").val(todo.description);
};

elmApp.ports.editTodo.subscribe(onEditTodo);
```

We hooked up the `onEditTodo` function to the Elm port called `editTodo`. We'll need to define that
port in `Main.elm`. While we are in the JavaScript code, we'll also send out a signal to Elm for
when a todo has been saved from the form:

[app.js](app.js)
```javascript
var elmApp = Elm.embed(Elm.Main, document.getElementById("app"), {saveTodo: null});
```

Our signal is called `saveTodo` and starts with a null value. Next, we'll listen for a click on the
_Save_ button, post the todo to the server, and send the response to Elm via the `saveTodo` port:

[app.js](app.js)
```javascript
var cancel = function(evt) {
  evt.preventDefault();
  $("#todoId").val("");
  $("#priority").val("");
  $("#description").val("");
};

$("#save").on("click", function(evt) {
  evt.preventDefault();
  var todo = {
    id: parseInt($("#todoId").val() || 0),
    priority: parseInt($("#priority").val() || 1),
    description: $("#description").val()
  };
  $.post("/api/saveTodo", JSON.stringify(todo), function(response) {
    elmApp.ports.saveTodo.send(response); //--<<----
    cancel(evt);
  }, "json");
});

$("#cancel").on("click", cancel);
```

For completeness, we've also cleared the form after saving the todo, and also hooked up the _Cancel_
button.

Now that we have a `saveTodo` signal going from JavaScript, we need to set it up as a `port` in our
Elm Main.

## Connecting the Signals in Elm

We need to add two ports in our Elm Main: `saveTodo` and `editTodo`:

[Main.elm](Main.elm)
```elm
port saveTodo : Signal (Maybe Todo) --<<----

todoMainFeature =
  createTodoMainFeature saveTodo --<<---- (1)


main : Signal Html
main =
  todoMainFeature.html


port tasks : Signal (Task Never ())
port tasks =
  todoMainFeature.tasks


port editTodo : Signal Todo --<<---
port editTodo =
  todoMainFeature.editTodoSignal --<<---- (2)
```

Our Main is ready to go. We need to do two things to set up our signals:

1. Change our previous `todoMainFeature` to a `createTodoMainFeature` function so that we can pass
the `saveTodo` signal as a parameter and pass it down to connect our features
1. Pass up the _edit_ signal from our features and return it as `editTodoSignal` from the
`todoMainFeature`.

Let's see how we pass in the `saveTodo` signal down to our features.

## Passing a Signal into a Feature

In `TodoMain.elm`, whereas before we had `todoManagerFeature` as:

```elm
todoManagerFeature : TodoManagerFeature
todoManagerFeature =
   createTodoManagerFeature
     { outputs =
         { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
         , onSaveTodo = []
         }
     }
```

Now we need to pass in the `saveTodo` signal from `Main.elm`. So we'll change that into a function
that accepts it as a parameter:

[TodoMain.elm](TodoMain.elm)
```elm
makeTodoManagerFeature : Signal (Maybe Todo) -> TodoManagerFeature
makeTodoManagerFeature saveTodoSignal =
  createTodoManagerFeature
    { inputs =
        [ Signal.map UpdateList saveTodoSignal ]
    , outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onSaveTodo = []
        }
    }
```

We're passing in `saveTodoSignal` into `TodoManagerFeature` by passing it in via `inputs`. Now, all
the `createTodoManagerFeature` function has to do is combine `inputs` with those that we were
already using previously:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
makeTodoListFeature config =
   createTodoListFeature
     { inputs = todoListMailbox.signal :: config.inputs --<<----
     , outputs = -- ...
     }
```

We've combined the inputs of the `TodoList` feature, and we do that in a similar fashion for the
`TodoSummary` feature.

Then we'll add the `createTodoMainFeature` function that receives `saveTodoSignal` and calls
`makeTodoManagerFeature`:

[TodoMain.elm](TodoMain.elm)
```elm
createTodoMainFeature saveTodoSignal =
  let
    todoManagerFeature =
      makeTodoManagerFeature saveTodoSignal
  {-- more code to come... --}
```

We also need to adjust the `html` and the `tasks`. Before, those were simply taken off of
`todoManagerFeature`, but now that it is created via a function call, we need to turn those into
function calls as well. Here is the modified code:

[TodoMain.elm](TodoMain.elm)
```elm
makeHtml : TodoManagerFeature -> TodoMinMaxFeature -> Signal Html
makeHtml todoManagerFeature todoMinMaxFeature =
  Signal.map2 todoMainView todoManagerFeature.html todoMinMaxFeature.html


makeTasks : TodoManagerFeature -> Signal (Task Never ())
makeTasks todoManagerFeature =
  todoManagerFeature.tasks


createTodoMainFeature saveTodoSignal =
  let
    todoManagerFeature =
      makeTodoManagerFeature saveTodoSignal

    html =
      makeHtml todoManagerFeature todoMinMaxFeature
  in
    { html = html
    , tasks = makeTasks todoManagerFeature
    }
```

## Passing a Signal out from a Feature

We've passed a signal from external JavaScript into an Elm feature, but how do we pass a signal out
from a Feature and back to the external JavaScript?

In our example, that signal is `editTodo` which comes from `TodoList` and is used to populate the
form. Remember that we wrote `todoMainFeature.editTodoSignal` in `Main.elm`. We need to return
`editTodoSignal` from `todoMainFeature`:

[TodoMain.elm](TodoMain.elm)
```elm
todoEditMailbox : Signal.Mailbox Todo
todoEditMailbox =
  Signal.mailbox blankTodo


makeTodoManagerFeature : Signal (Maybe Todo) -> TodoManagerFeature
makeTodoManagerFeature saveTodoSignal =
  createTodoManagerFeature
    { inputs =
        [ Signal.map UpdateList saveTodoSignal ]
    , outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onEditTodo = [ todoEditMailbox.address ] --<<----
        }
    }


createTodoMainFeature saveTodoSignal =
  let
    todoManagerFeature =
      makeTodoManagerFeature saveTodoSignal

    html =
      makeHtml todoManagerFeature todoMinMaxFeature
  in
    { html = html
    , tasks = makeTasks todoManagerFeature
    , editTodoSignal = todoEditMailbox.signal --<<----
    }
```

## Conclusion

We've seen how we can pass data between external JavaScript code and an Elm application.

I hope you enjoyed this series. Thank you for reading!

If you enjoy this article, consider [tweeting](https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&text=Composing%20Features%20and%20Behaviours%20in%20the%20Elm%20Architecture&tw_p=tweetbutton&url=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&via=foxdonut00) it to your followers.

Fred Daoud - foxdonut, @foxdonut00
