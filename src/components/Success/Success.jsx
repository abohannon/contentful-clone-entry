import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Note, Spinner, TextLink } from '@contentful/forma-36-react-components'
import SuccessEntry from './SuccessEntry'
import contentful from '../../util/contentfulUtil'
import { PENDING, RESOLVED, REJECTED, CONTENTFUL_ENTRY_URL } from '../constants'
import './SuccessStyle.scss'

const Success = ({ message, onDelete }) => {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    setEntries(contentful.getClonedEntries().reverse())
  }, [])

  const deleteAllEntries = async () => {
    setStatus(PENDING)

    const errors = []

    for (const entry of entries) {
      const response = await onDelete(entry.data)

      if (response.error) {
        errors.push(entry)
      }
    }

    if (errors.length) {
      setStatus(REJECTED)
      return setErrors(errors)
    }

    return setStatus(RESOLVED)
  }

  const showDefault = () => (
    <React.Fragment>
      <div>
        <b>{message}</b>&nbsp;
        <u className="success-undo" onClick={deleteAllEntries}>
          undo all
        </u>
      </div>
      {entries.map(entry => (
        <SuccessEntry key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </React.Fragment>
  )

  const showSpinner = () => (
    <div className="success-spinner">
      <Spinner size="large" />
    </div>
  )

  const errorMessage = () => (
    <React.Fragment>
      <div>
        <b>There were errors deleting the following entries:</b>
      </div>
      <div>
        {errors.map(error => (
          <div key={error.id}>
            <TextLink
              linkType="negative"
              icon="Warning"
              target="_blank"
              href={`${CONTENTFUL_ENTRY_URL}${error.id}`}
            >
              {error.name}
            </TextLink>
          </div>
        ))}
      </div>
    </React.Fragment>
  )

  const successMessage = () => (
    <div>
      <b>All entries have been successfully deleted.</b>
    </div>
  )

  const renderContent = () => {
    switch (status) {
      case PENDING:
        return showSpinner()
      case RESOLVED:
        return successMessage()
      case REJECTED:
        return errorMessage()
      default:
        return showDefault()
    }
  }

  return (
    <Note noteType={status === REJECTED ? 'negative' : 'positive'}>
      {renderContent()}
    </Note>
  )
}

Success.propTypes = {
  message: PropTypes.string,
  onDelete: PropTypes.func,
}

Success.defaultProps = {
  message: 'Entries cloned successfully!',
}

export default Success
