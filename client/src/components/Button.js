import React from 'react'
import classname from 'classname'

import Icon from './Icon'
// import Spinner from './Spinner'


function Button(props) {
  const {
    className,
    variantProp,
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

  const variant =
    iconButton ? 'icon' :
    variantProp ? variantProp :
                 'primary'

  const buttonClassName = classname(
    'Button',
    variant ? `--${variant}` : undefined,
    className,
    size,
    {
      'active': active,
      'round': round,
      '--icon': iconButton,
      'center': center,
    }
  )

  return (
    <button className={buttonClassName}
      onClick={onClick}
      disabled={loading || disabled}
      {...rest}
    >
      { icon !== undefined && ((iconButton && !loading) || !iconButton) &&
          <Icon name={icon} marginRight={iconButton ? 0 : 5} className='Button__icon' /> }
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
