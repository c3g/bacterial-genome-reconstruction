import React from 'react'

import renderDuration from '../helpers/render-duration'

import RandomFact from './RandomFact'
import Spinner from './Spinner'

const Nbsp = () => '\u00A0'

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
              <><span><Nbsp /></span></>
            }
          </small><br/>
          <small>
            {status && eta !== undefined && (eta !== -1) &&
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
