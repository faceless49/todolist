import React, {ChangeEvent, useState} from 'react';
import s from './EditableSpan.module.scss'

type EditableSpanPropsType = {
  className: string
  title: string
  changeTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {

  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)

  const onEditMode = () => setEditMode(true)
  const offEditMode = () => {
    props.changeTitle(title)
    setEditMode(false);
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return (
    editMode
      ? <input
        autoFocus
        value={title}
        onBlur={offEditMode}
        onChange={onChangeHandler}
      />
      : <span
        onDoubleClick={onEditMode}
        className={props.className}>{props.title}</span>
  );
};

