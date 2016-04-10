import { render } from "react-dom";
import { taskRunner } from "meiosis";

import createTodoMain from "./todoMain.jsx";

const element = document.getElementById("app");

const todoMain = createTodoMain();

// view rendering
todoMain.view$.subscribe(view => render(view, element));

// ports
todoMain.task$.subscribe(taskRunner);
