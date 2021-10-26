import React from "react";
import s from "./Button.module.scss";
import { FilterValueType } from "../../store/todolistsReducer";

type propsType = {
  callBack: () => void;
  value: string;
  filter?: FilterValueType;
};

const Button = (props: propsType) => {
  return (
    <button
      className={props.filter === props.value ? s.activeFilter : ""}
      onClick={props.callBack}
    >
      {props.value}
    </button>
  );
};
