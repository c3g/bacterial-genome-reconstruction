import React from 'react'

import renderDuration from '../helpers/render-duration'

import RandomFact from './RandomFact'
import Spinner from './Spinner'


function TaskSpinner({ message, status, order, eta, loading, children }) {

  return (
    <Spinner
      block
      size='5x'
      message={
        <div>
          <b>
            {message}
          </b>
          <br/>
          <small>
            {status ?
              <>
                Task is {status} in position {order + 1}
              </> :
              <>&nbsp;</>
            }
          </small><br/>
          <small>
            {status && (eta !== -1) &&
              <>{renderDuration(eta)} remaining</>
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
