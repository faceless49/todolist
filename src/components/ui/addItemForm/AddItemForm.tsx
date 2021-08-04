import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

type inputType = {
  callBack: (newTitle: string) => void
}

export const AddItemForm = React.memo((props: inputType) => {
    console.log('Additem render')

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
      if (error !== null) {
        setError(null)
      }
      if (e.key === 'Enter') {
        onClickHandler()
      }
    }

    return (
      <div>
        <TextField
          value={title}
          label={'Title'}
          variant={'outlined'}
          size={'small'}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          error={!!error} // ! TODO: Use StyleComponent later for text required
          helperText={error && error}
        />

        <IconButton
          size={'small'}
          color={'primary'}
          onClick={onClickHandler}>
          <AddBox/>
        </IconButton>
      </div>
    );
  })
;

