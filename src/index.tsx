import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWithRedux from "./app/AppWithRedux";
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.render(
  <Provider store={store}>
    <AppWithRedux />,
  </Provider>,
  document.getElementById("root")
);
