import React, {ChangeEvent} from 'react';

type inputType = {
  callBack: () => void
}

export const Input = (props: inputType) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
  }

  return (
    <div>
      <input onChange={onChangeHandler}/>
      <button onClick={() => props.callBack()}>+</button>
    </div>
  );
};

