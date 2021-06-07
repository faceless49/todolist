import React from 'react';

type propsType = {
  callBack: () => void
  value: string
}

export const Button = (props: propsType) => {

  const onClickHandler = () => {
    props.callBack()
  }
  return (
    // <button onClick={() => props.callBack()}>{props.value}</button>
    <button onClick={onClickHandler}>{props.value}</button>
  )
}
