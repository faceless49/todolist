import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";
import s from "./EditableSpan.module.scss";
import { TextField } from "@mui/material";

type EditableSpanPropsType = {
  className?: string;
  title: string;
  changeTitle: (title: string) => void;
};

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.title);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.title);
  };
  const offEditMode = () => {
    if (title) {
      props.changeTitle(title);
    }
    setEditMode(!activateEditMode);
  };

  const changeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  }, []);
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      offEditMode();
    }
  }; // TODO: Why when i wrapped onkeypresshandler usecallback no set title

  return editMode ? (
    <TextField
      autoFocus
      value={title}
      onBlur={offEditMode}
      onChange={changeTitle}
      onKeyPress={onKeyPressHandler}
    />
  ) : (
    <span onDoubleClick={activateEditMode} className={props.className}>
      {props.title}
    </span>
  );
});
