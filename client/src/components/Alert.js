import React from 'react'
import cx from 'classname'

import Icon from './Icon'

import './Alert.scss'


const iconByVariant = {
  'info':    'info-circle',
  'success': 'check-circle',
  'warning': 'exclamation-triangle',
  'error':   'exclamation-triangle',
}

function Alert(props) {
  const {
    className,
    variant,
    size,
    icon = iconByVariant[variant],
    children,
    ...rest
  } = props

  const alertClassName = cx(
    'Alert',
    variant ? `--${variant}` : undefined,
    variant ? `text-${variant}` : undefined,
    className,
    size,
  )

  return (
    <div className={alertClassName} {...rest}>
      <div className='Alert__icon'>
        <Icon name={icon} />
      </div>
      <div className='Alert__content'>
        {children}
      </div>
    </div>
  )
}

export default Alert
