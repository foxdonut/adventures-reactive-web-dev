# Composing Features and Behaviours in the Elm Architecture

by Fred Daoud - foxdonut, [@foxdonut00](https://twitter.com/foxdonut00)

**New 2016-04-08**: [Part 5: Connecting With External JavaScript](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-050-external-port/client-elm#connecting-with-external-javascript)

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests,
are welcome.

## What is this article about?

I wrote this article out of wondering how to organize code that follows the Elm architecture. I
wanted to divide the code for parts of a page (call them components, sections, blocks, etc., I'll
call them features from here on out) into their own directories. I wanted each feature to be
independent of the others, but find a way for them to communicate information with each other.
Finally, I wanted to see if I could group some of these features together to assemble larger
features, while still keeping the same pattern of inter-feature communication.

I also did not want to reinvent the wheel, so I am not replacing `StartApp`. In fact, each feature
is built with `StartApp` and is itself an `App`. They are assembled together to form the final `App`
that is used in the top-level `Main`.

Some disclaimers: I only recently started learning Elm, and do not claim to be an expert.
Furthermore, I do not claim to have invented any of the ideas presented in this article. The purpose
is simply to put together what I feel are the best parts of what I have learned from
[The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/),
[Cycle.js](http://cycle.js.org/model-view-intent.html),
[RxJS](https://github.com/Reactive-Extensions/RxJS),
[Redux](http://redux.js.org/docs/introduction/ThreePrinciples.html), and others.

That being said, my goal is to explain an approach to organize Elm code into _features_, where each
feature is part of a page and is decoupled from other features, and to connect these features with
_behaviours_. Behaviours are "what happens next" during a View -> Action -> Signal -> Update -> View
cycle. Specifically, we want to be able to

- Create features: each feature should be self-contained and independent of other features.
- Chain events: _after this happens, that should happen next_.
- Connect features with signals: _after this happens, notify all other features that want to be notified_,
without needing to "know" what those other features are. Features react to events: _do something
when **this** happens_, without needing to "know" which feature made **this** happen.
- Build a large feature out of smaller features: useful to make a group of features reusable as a
whole, without having to re-create the group each time.
- Be able to connect to external JavaScript code and exchange data in both directions.

This will hopefully become clear when we dig into it and look at the code. What's important to know
before reading on is that I assume knowledge of The Elm Architecture, because I build on top of that
and will not go over the Elm Architecture itself. Please refer to
[The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/)
and [The Elm Tutorial](http://www.elm-tutorial.org/).

## Example Overview

I will use a simple Todo list application as an example. The application is on a single page, with a
list of todos and a form, allowing for creating, editing, and deleting todos. We'll add a summary at
the bottom which shows the total number of todos and the average priority. Finally, we'll add a
section at the top that shows the highest and lowest priority of the todo list.

<img src="images/todo-example.png" width="400"/>

The application is backed by a server that accepts requests, using JSON as the data exchange format.
The server is implemented with [Koa](http://koajs.com/). I won't go into the details of the server
implementation since it is not the focus of this article.

## Running the Application

The instructions to run the example application are the same as for all of the other examples, so
please follow the
[top level instructions](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master#requirements).

## Article

The article is divided into five parts, each in a separate branch:

- [Part 1: Creating a Feature](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-010-todolist-feature/client-elm#creating-a-feature)
- [Part 2: Connecting Features Together](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-020-todoform-feature/client-elm#connecting-features-together)
- [Part 3: Multiple Listeners](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-030-todosummary-feature/client-elm#multiple-listeners)
- [Part 4: Composing Features](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-040-todominmax-feature/client-elm#composing-features)
- [Part 5: Connecting With External JavaScript](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-050-external-port/client-elm#connecting-with-external-javascript)

The code in master is the same as in Part 4. (Not Part 5, because that is a demonstration of using
external JavaScript, but is not the main example.)

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests, are welcome.

If you enjoy this article, consider [tweeting](https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&text=Composing%20Features%20and%20Behaviours%20in%20the%20Elm%20Architecture&tw_p=tweetbutton&url=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&via=foxdonut00) it to your followers.
