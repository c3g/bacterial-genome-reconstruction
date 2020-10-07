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
          Message: <code>{stringify(message)}</code>
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

function stringify(error) {
  if (typeof error === 'string')
    return error
  if (error === null)
    return '[Null error message :/]'
  if (typeof error === 'object')
    return JSON.stringify(error)
}

export default ErrorMessage
