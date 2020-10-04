import React from 'react'
import cx from 'classname'

import Icon from './Icon'

import './Instructions.scss'

function Instructions({ className, children, ...rest }) {
  return (
    <div className={cx('Instructions', className)} {...rest}>
      <div className='Instructions__icon'>
        <Icon name='info-circle' />
      </div>
      <div className='Instructions__content'>
        {children}
      </div>
    </div>
  )
}

export default Instructions
