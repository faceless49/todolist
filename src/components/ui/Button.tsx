import React from 'react';

type propsType = {
  callBack: () => void
  value: string
}

export const Button = (props: propsType) => {
  return (
    <button onClick={() => props.callBack()}>{props.value}</button>
  )
}
