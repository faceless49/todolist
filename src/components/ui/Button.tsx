import React from 'react';
import {keyType} from '../../App';
import s from './Button.module.scss'
type propsType = {
  callBack: () => void
  value: string
  filter?: keyType
}

const Button = (props: propsType) => {

  return (
    <button className={props.filter === props.value ? s.activeFilter : ''}
            onClick={props.callBack}>{props.value}</button>
  )
}
