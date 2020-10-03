import React, { useState } from 'react'
import cx from 'classname'

import Icon from './Icon'

function Spinner(props) {
  const {
    className,
    message,
    size = 'lg',
    block,
    loading = true,
    children,
  } = props

  const [hidden, setHidden] = useState(!loading)

  const isHidding = !loading && !hidden

  if (loading && hidden) {
    setHidden(false)
  }

  if (hidden) {
    return React.Children.map(children, element =>
      !element ? element :
        React.cloneElement(element, {
          className: cx('Spinner__children', element.props.className),
        })
    )
  }

  return (
    <div
      className={cx(
        'Spinner',
        className,
        block && '--block',
        isHidding && '--hidding'
      )}
      onTransitionEnd={() => setHidden(true)}
    >
      <Icon
        className='Spinner__icon'
        name='circle-o-notch'
        variant='muted'
        size={size}
        spin
      />
      {message &&
        <div className='Spinner__message text-muted'>
          {message}
        </div>
      }
    </div>
  )
}

export default Spinner
