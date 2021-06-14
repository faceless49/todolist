import React from 'react';
import {keyType} from '../../App';
import s from './Button.module.css'
type propsType = {
  callBack: () => void
  value: string
  filter?: keyType
}

export const Button = (props: propsType) => {

  return (
    <button className={props.filter === props.value ? s.activeFilter : ''}
            onClick={ () => props.callBack()}>{props.value}</button>
  )
}
