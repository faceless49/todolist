import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { AddBox } from "@mui/icons-material";

export type AddItemFormSubmitHelperType = {
  setError: (error: string) => void;
  setTitle: (title: string) => void;
};
type AddItemFormPropsType = {
  addItem: (newTitle: string, helpers: AddItemFormSubmitHelperType) => void;
  disabled?: boolean;
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<null | string>(null);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const addItemHandler = async () => {
    if (title.trim() !== "") {
      props.addItem(title, { setError, setTitle });
    } else {
      setError("Title is required");
    }
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.key === "Enter") {
      addItemHandler();
    }
  };

  return (
    <div>
      <TextField
        value={title}
        label={"Title"}
        variant={"outlined"}
        size={"small"}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        error={!!error} // ! TODO: Use StyleComponent later for text required
        helperText={error}
        disabled={props.disabled}
      />
      <IconButton
        size={"small"}
        color={"primary"}
        onClick={addItemHandler}
        disabled={props.disabled}
      >
        <AddBox />
      </IconButton>
    </div>
  );
});
