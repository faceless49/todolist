import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, IconButton} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

type inputType = {
  callBack: (newTitle: string) => void
}

export const AddItemForm = (props: inputType) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<null | string>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value)
    }

    const onClickHandler = () => {
      if (title) {
        props.callBack(title.trim())
        setTitle('')
        setError(null)
      } else {
        setError('Title is required')
      }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onClickHandler()
      }
    }

    return (
      <div>
        <input
          value={title}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          className={error ? 'error' : ''}
        />
        <IconButton
          size={'small'}
          color={'primary'}
          onClick={onClickHandler}>
          <AddBox/>
        </IconButton>
        {/*<button onClick={onClickHandler}>+</button>*/}
        {error && <div className={'error-message'}>{error}</div>}
      </div>
    );
  }
;

