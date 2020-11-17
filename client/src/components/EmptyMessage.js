import React from 'react'

import Alert from './Alert'
import Button from './Button'

function EmptyMessage({ previousStep }) {
  return (
    <>
      <Alert variant='warning'>
        <h4>Snap! We couldn't find any match for your input :/</h4>
        <p>
          If you think this might be a bug,{' '}
          <a href='mailto:mailto:info@computationalgenomics.ca'>contact us</a>{' '}
          to report it.
        </p>
      </Alert>
      <div className='flex-row'>
        <Button variant='simple' onClick={previousStep}>
          Go Back
        </Button>
      </div>
    </>
  )
}

export default EmptyMessage
