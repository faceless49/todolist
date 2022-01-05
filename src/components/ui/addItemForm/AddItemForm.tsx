import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";
import { IconButton, TextField } from "@mui/material";
import { AddBox } from "@mui/icons-material";

type AddItemFormPropsType = {
  addItem: (newTitle: string) => void;
  disabled?: boolean;
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  // Обернули в хок, но у нас в пропсах addItem callback, поэтому перерисовка все равно произойдет

  let [title, setTitle] = useState("");
  let [error, setError] = useState<null | string>(null);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onClickHandler = useCallback(() => {
    if (title) {
      props.addItem(title.trim());
      setTitle("");
      setError(null);
    } else {
      setError("Title is required");
    }
  }, [props, title]);

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.key === "Enter") {
      onClickHandler();
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
        onClick={onClickHandler}
        disabled={props.disabled}
      >
        <AddBox />
      </IconButton>
    </div>
  );
});
