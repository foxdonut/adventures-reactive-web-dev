import React from "react";
import K, {bindProps, fromIds} from "kefir.react.html";

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
      <K.tr key={todo.id}>
        <K.td>{todo.priority}</K.td>
        <K.td>{todo.description}</K.td>
        <td>
          <button className="btn btn-primary btn-xs" onClick={onEdit(todo)}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs" onClick={onDelete(todo)}>Delete</button>
        </td>
      </K.tr>
    );
  };

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
          <K.tbody>
            {/*inProgressIndicator(model)*/}
            {K(model.lens("todos"), todos => todos.map(renderTodo))}
          </K.tbody>
        </table>
      </div>
    </div>
  );
};

export default View;
