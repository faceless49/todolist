import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { HashRouter } from "react-router-dom";
import App from "./app/App";

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />,
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
