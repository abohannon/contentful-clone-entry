import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextLink, Spinner } from '@contentful/forma-36-react-components'
import {
  PENDING,
  RESOLVED,
  REJECTED,
  CONTENTFUL_ENTRY_URL,
} from '../../constants'
import './SuccessEntryStyle.scss'

const SuccessEntry = ({ entry, onDelete }) => {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)
  const [linkState, setLinkState] = useState({
    linkType: 'positive',
    icon: 'CheckCircle',
  })

  useEffect(() => {
    switch (status) {
      case PENDING:
        return setLinkState({
          linkType: 'positive',
          icon: null,
        })
      case RESOLVED:
        return setLinkState({
          linkType: 'muted',
          icon: 'Close',
        })
      case REJECTED:
        return setLinkState({
          linkType: 'negative',
          icon: 'Warning',
        })
      default:
        return undefined
    }
  }, [status])

  const handleDelete = async () => {
    setStatus(PENDING)
    const response = await onDelete(entry.data)

    if (response.error) {
      setStatus(REJECTED)
      return setError(response.error)
    }

    return setStatus(RESOLVED)
  }

  return (
    <div className="success-entry">
      {status === PENDING && (
        <Spinner className="success-entry-spinner" size="small" />
      )}
      <TextLink
        linkType={linkState.linkType}
        href={`${CONTENTFUL_ENTRY_URL}${entry.id}`}
        target="_blank"
        icon={linkState.icon}
      >
        {entry.name}
      </TextLink>
      {status !== RESOLVED && (
        <React.Fragment>
          &nbsp;|{' '}
          <u
            data-test-id={`SuccessEntry-undo-${entry.id}`}
            className="success-undo"
            onClick={handleDelete}
          >
            undo
          </u>
        </React.Fragment>
      )}
    </div>
  )
}

SuccessEntry.propTypes = {
  entry: PropTypes.object,
}

export default SuccessEntry
