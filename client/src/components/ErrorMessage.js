import React from 'react'

import Alert from './Alert'
import Button from './Button'

function ErrorMessage({ message, previousStep }) {
  return (
    <>
      <Alert variant='error'>
        <h4>Snap! An error occured while processing the request :/</h4>
        <p>
          Try again later or{' '}
          <a href='mailto:mailto:info@computationalgenomics.ca'>contact us</a>{' '}
          to report your issue.<br />
          <br />
          Message: <code>{message}</code>
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

export default ErrorMessage
