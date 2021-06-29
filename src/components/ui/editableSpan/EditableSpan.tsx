import React, {ChangeEvent, useState} from 'react';
import s from './EditableSpan.module.scss'

type EditableSpanPropsType = {
  className: string
  title: string
}

export const EditableSpan = (props: EditableSpanPropsType) => {

  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)


  return (
    editMode
      ? <input
        value={title}
      />
      : <span className={props.className}>{props.title}</span>
  );
};

