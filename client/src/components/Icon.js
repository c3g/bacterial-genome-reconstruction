import React from 'react'
import cx from 'classname'

function Icon(props) {
  const {
    name,
    variant,
    size,
    className,
    spin,
    marginLeft,
    marginRight,
    style = {},
    ...rest
  } = props

  return (
    <i
      className={iconCx(className, name, size, variant, spin)}
      style={{
        marginLeft,
        marginRight,
        ...style,
      }}
      {...rest}
    />
  )
}

function iconCx(className, name, size, variant, spin) {
  return cx(
    'Icon',
    className,
    'fa',
    `fa-${name}`,
    size ? `fa-${size}` : undefined,
    variant ? `text-${variant}` : undefined,
    spin ? 'fa-spin' : undefined,
  )
}

export default Icon
