import React from "react";
import {reduxForm} from "redux-form";
import validation from "./validation";

const formConfig = {
  form: "TodoForm",
  fields: ["id", "priority", "description"],
  validate: validation
};

const mapStateToProps = state => ({ initialValues: state.todoForm.todo });

const View = function(props) {
  const {fields: {id, priority, description}, handleSubmit, resetForm} = props;

  const saveTodo = form => {
    props.dispatch(props.actions.saveTodo(form));
    resetForm();
  };

  const getField = field => props.fields[field];
  const errorMessage = field => getField(field).touched ? getField(field).error : "";
  const fieldClasses = field => `form-group ${getField(field).touched && getField(field).invalid ? "has-error" : ""}`;

  return (
    <div className="row">
      <div className="col-md-4">
        <form>
          <input type="hidden" {...id}/>
          <div className={fieldClasses("priority")}>
            <label>Priority:</label>
            <input type="text" className="form-control" {...priority}/>
            <span className="help-block">{errorMessage("priority")}</span>
          </div>
          <div className={fieldClasses("description")}>
            <label>Description:</label>
            <input type="text" className="form-control" {...description}/>
            <span className="help-block">{errorMessage("description")}</span>
          </div>
          <div>
            <button className="btn btn-primary btn-xs" onClick={handleSubmit(saveTodo)}>Save</button>
            <span> </span>
            <button className="btn btn-default btn-xs" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default reduxForm(formConfig, mapStateToProps)(View);
