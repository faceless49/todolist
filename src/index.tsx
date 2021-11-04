import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWithRedux from "./app/AppWithRedux";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, HashRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <AppWithRedux />,
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
