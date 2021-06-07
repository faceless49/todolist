import React, {ChangeEvent, useState} from 'react';

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
    console.log(title)
  }
  return (
    <div>
      <input
        value={title}
        onChange={onChangeHandler}/>
      <button onClick={onClickHandler}>+</button>
    </div>
  );
};

