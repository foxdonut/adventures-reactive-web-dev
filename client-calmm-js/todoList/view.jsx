import React from "react";

const View = function({model}) {
  const onEdit = todo => evt => {
    evt.preventDefault();
    //props.dispatch(props.actions.editTodo(todo));
  };

  const onDelete = todo => evt => {
    evt.preventDefault();
    //props.dispatch(props.actions.deleteTodo(todo));
  };

  const renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs" onClick={onEdit(todo)}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs" onClick={onDelete(todo)}>Delete</button>
        </td>
      </tr>
    );
  };

//FIXME
  const todos = model.todos || [];

  const inProgressIndicator = function(model) {
    return model.inProgress ?
        <tr><td colSpan="3">Loading, please wait...</td></tr>
      : null;
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <div>Todo List:</div>
        <table className="table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inProgressIndicator(model)}
            {todos.map(renderTodo)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default View;
