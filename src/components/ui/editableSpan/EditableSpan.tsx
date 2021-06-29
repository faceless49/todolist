import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import s from './EditableSpan.module.scss'

type EditableSpanPropsType = {
  className?: string
  title: string
  changeTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {

  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)

  const onEditMode = () => setEditMode(true)
  const offEditMode = () => {
    if (title) {
      props.changeTitle(title)
    }
    setEditMode(false)
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      offEditMode()
    }
  }


  return (
    editMode
      ? <input
        autoFocus
        value={title}
        onBlur={offEditMode}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
      />
      : <span
        onDoubleClick={onEditMode}
        className={props.className}>{props.title}</span>
  );
};

