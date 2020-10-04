import React from 'react'

import RandomFact from './RandomFact'
import Spinner from './Spinner'


function TaskSpinner({ message, status, order, loading, children }) {

  return (
    <Spinner
      block
      size='5x'
      message={
        <div>
          <b>{message}</b><br/>
          <small>
            {status ?
              <>Task is {status} in position {order + 1}</> :
              <>&nbsp;</>
            }
          </small><br/>
          <br/>
          <RandomFact />
        </div>
      }
      loading={loading}
    >
      {children}
    </Spinner>
  )
}

export default TaskSpinner
