import React from 'react'
import PropTypes from 'prop-types'
import { Note } from '@contentful/forma-36-react-components'

const Error = ({ message, error }) => {
  const helperMessage = () => {
    switch (error.code) {
      case 'NotFound':
        return 'You might have an entry missing or inaccessible. Did you delete an entry recently?'
      default:
        return ''
    }
  }

  return (
    <Note noteType="negative">
      <div data-test-id="ErrorMessage-root">
        <b>{message}</b>
      </div>
      {error && (
        <div>
          <i>
            {error.message} {helperMessage()}
          </i>
        </div>
      )}
    </Note>
  )
}

Error.propTypes = {
  message: PropTypes.string,
  error: PropTypes.object,
}

Error.defaultProps = {
  message: 'Uh oh, there was an error.',
  error: null,
}

export default Error
