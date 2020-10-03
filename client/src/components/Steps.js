import React from 'react'
import cx from 'classname'

import Icon from './Icon'

import './Steps.scss'


function Steps({ tabs, active, enabled, onChange }) {
  return (
    <div className='Steps'>
      {
        tabs.map((tab, i) => {

          const isEnabled = i <= enabled
          const isActive = i === active

          return (
            <div
              key={i}
              className={cx('Step', {
                '--enabled': isEnabled,
                '--active': isActive,
              })}
              role='button'
              onClick={isEnabled ? () => onChange(i) : undefined}
            >
              <div className='Step__icon'>
                {isEnabled && !isActive ?
                  <Icon name='check' variant='normal' /> :
                  tab.icon
                }
              </div>
              <div className='Step__title'>{tab.title}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Steps
