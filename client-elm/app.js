var Elm = require("./Main.elm");
var elmApp = Elm.embed(Elm.Main, document.getElementById("app"), {saveTodo: null});

var container = document.getElementById("todoForm");
container.innerHTML = "<div class='row'>" +
  "<div class='col-md-4'>" +
  "<form>" +
  "<input type='hidden' name='id' id='todoId'>" +
  "<div class='form-group'>" +
  "<label for='priority'>Priority:</label>" +
  "<input class='form-control' name='priority' id='priority'>" +
  "</div>" +
  "<div class='form-group'>" +
  "<label for='description'>Description:</label>" +
  "<input class='form-control' name='description' id='description'>" +
  "</div>" +
  "<div>" +
  "<button class='btn btn-primary btn-xs' id='save'>Save</button> " +
  "<button class='btn btn-danger btn-xs' id='cancel'>Cancel</button>" +
  "</div>" +
  "</form></div></div>";

var $ = require("jquery");

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
    elmApp.ports.saveTodo.send(response);
    cancel(evt);
  }, "json");
});

$("#cancel").on("click", cancel);

var editTodo = function(todo) {
  $("#todoId").val(todo.id);
  $("#priority").val(todo.priority);
  $("#description").val(todo.description);
};

elmApp.ports.editTodo.subscribe(editTodo);
