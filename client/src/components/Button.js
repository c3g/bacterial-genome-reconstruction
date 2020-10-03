import React from 'react'
import classname from 'classname'

import Icon from './Icon'
// import Spinner from './Spinner'


function Button(props) {
  const {
    className,
    type,
    size,
    active,
    round,
    iconButton,
    center,
    // Other:
    loading,
    disabled,
    children,
    icon,
    iconAfter,
    onClick,
    ...rest
  } = props

  const buttonClassName = classname(
    'Button',
    className,
    type,
    size,
    {
      'active': active,
      'round': round,
      'Button--icon': iconButton,
      'center': center,
      'has-icon': icon !== undefined,
    }
  )

  return (
    <button className={buttonClassName}
      onClick={onClick}
      disabled={loading || disabled}
      {...rest}
    >
      { icon !== undefined && ((iconButton && !loading) || !iconButton) &&
          <Icon name={icon} marginRight={5} className='Button__icon' /> }
      {
        children &&
          <span>{ children }</span>
      }
      {
        /* loading &&
         *   <Spinner /> */
      }
      { iconAfter !== undefined && !loading &&
        <Icon name={iconAfter} className='Button__iconAfter' />
      }
    </button>
  )
}

export default Button
