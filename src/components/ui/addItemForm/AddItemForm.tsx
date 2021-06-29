import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

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
        <button onClick={onClickHandler}>+</button>
        {error && <div className={'error-message'}>{error}</div>}

      </div>
    );
  }
;

