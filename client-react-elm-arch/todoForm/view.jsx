import React from "react";
import serialize from "form-serialize";

import { Action } from "./action";

const view = actions => model => {
  const getTodo = evt => serialize(evt.target.form, {hash: true});

  const onChangeText = evt => 
    actions.next(Action.Edit(getTodo(evt)));

  const onSave = evt => {
    evt.preventDefault();
    actions.next(Action.Save(getTodo(evt)));
  };

  const onCancel = function(evt) {
    evt.preventDefault();
    actions.next(Action.ClearForm());
  };

  const todo = model.todo;

  return (
    <div className="row">
      <div className="col-md-4">
        <form>
          <input type="hidden" name="id" value={todo.id}/>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <input type="text" id="priority" name="priority" className="form-control" value={todo.priority} onChange={onChangeText}/>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" className="form-control" value={todo.description} onChange={onChangeText}/>
          </div>
          <div>
            <button className="btn btn-primary btn-xs" onClick={onSave} data-action="save">Save</button>
            <span> </span>
            <button className="btn btn-danger btn-xs" onClick={onCancel} data-action="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { view };
