import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type inputType = {
  callBack: (newTitle: string) => void

}

export const Input = (props: inputType) => {
  let [title, setTitle] = useState('')

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onClickHandler = () => {
    props.callBack(title)
    setTitle('')
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e.charCode);
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
      />
      <button onClick={onClickHandler}>+</button>
    </div>
  );
};

