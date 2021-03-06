import React from "react";

export default function(todos, events$) {
  const onEdit = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.editTodo$.onNext(todo);
    }
  };

  const onDelete = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.deleteTodo$.onNext(todo.id);
    }
  };

  const renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs" data-action="edit" onClick={onEdit(todo)}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs" data-action="delete" onClick={onDelete(todo)}>Delete</button>
        </td>
      </tr>
    );
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <div>Todo List:</div>
        <table className="table ng-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(renderTodo)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
