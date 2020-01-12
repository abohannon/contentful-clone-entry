import './DialogStyle.scss'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import tokens from '@contentful/forma-36-tokens'
import {
  Button,
  Note,
  CheckboxField,
} from '@contentful/forma-36-react-components'
import EntryList from '../EntryList'
import LoadingAnimation from '../LoadingAnimation'
import Success from '../Success'
import Error from '../Error'
import contentful from '../../util/contentfulUtil'
import { PENDING, RESOLVED, REJECTED, CONTENTFUL_ENTRY_URL } from '../constants'

const Dialog = ({ sdk }) => {
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  const defaultMessage = (
    <Note noteType="primary">
      Only select entries you need to change. Selected entries will be
      duplicated which applies against the Contentful entry quota for this
      workspace.
    </Note>
  )

  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(defaultMessage)
  const [values, setValues] = useState({})
  const [toggleAll, setToggleAll] = useState(false)

  const handleDelete = async entry => {
    return contentful.deleteEntry(entry, sdk.space)
  }

  const updateEntries = async () => {
    setStatus(PENDING)

    const {
      invocation: { ids },
    } = sdk.parameters

    if (!ids) return

    const result = await contentful.buildEntryTree(ids.entry, sdk.space)

    if (result.error) {
      setStatus(REJECTED)
      setMessage(<Error error={result.error} />)
      return setEntries([])
    }

    setStatus(null)

    return setEntries(result)
  }

  useEffect(() => {
    updateEntries()
  }, [])

  const handleClone = async () => {
    setError(null)
    setStatus(PENDING)

    const {
      invocation: { ids },
    } = sdk.parameters

    if (!ids) return null

    try {
      const result = await contentful.cloneEntry(ids.entry, sdk.space, {
        entriesToClone: values,
      })

      if (!result) throw 'No result returned.'

      setStatus(RESOLVED)
      setMessage(<Success onDelete={handleDelete} />)
    } catch (err) {
      setStatus(REJECTED)
      setMessage(<Error />)
      setError({ message: err })
    }
  }

  const recursivelyToggleChildren = (entry, state, activeState) => {
    if (!entry || !entry.children.length) return state
    let newState = { ...state }

    for (const child of entry.children) {
      newState[child.id] = activeState

      if (child.children.length) {
        newState = recursivelyToggleChildren(child, newState, activeState)
      }
    }

    return newState
  }

  const handleToggle = () => {
    if (entries.length) {
      setValues(prevState => {
        const parent = entries[0]

        let newState = {
          ...prevState,
          [parent['id']]: toggleAll,
        }

        newState = recursivelyToggleChildren(parent, newState, toggleAll)

        return newState
      })
    }
  }

  useEffect(() => {
    handleToggle()
  }, [toggleAll])

  const handleChange = entry => ({ target }) => {
    const { parentIds } = entry

    return setValues(prevState => {
      let newState = {
        ...prevState,
        [target.name]: target.checked,
      }

      if (!target.checked) {
        newState = recursivelyToggleChildren(entry, newState)
      }

      if (parentIds.length) {
        parentIds.forEach(id => {
          newState[id] = true
        })
      }

      return newState
    })
  }

  const noEntriesSelected = () =>
    !Object.keys(values).some(key => values[key] === true)

  const disableButton =
    status === PENDING || status === RESOLVED || noEntriesSelected()

  return (
    <div
      id="dialog"
      className="dialog-root"
      style={{ margin: tokens.spacingM }}
    >
      {status === PENDING ? (
        <LoadingAnimation />
      ) : (
        <React.Fragment>
          {message}
          <div>
            <CheckboxField
              id="Dialog-selectAll"
              className="select-all"
              name="selectAll"
              labelText="Select all"
              onChange={() => setToggleAll(prevState => !prevState)}
              checked={toggleAll}
              inputProps={{
                style: { cursor: 'pointer' },
              }}
            />
            <EntryList
              entries={entries}
              onChange={handleChange}
              values={values}
            />
          </div>
        </React.Fragment>
      )}
      <div className="dialog-buttons">
        <Button
          className="dialog-button"
          testId="Dialog-confirm-button"
          buttonType="primary"
          onClick={handleClone}
          disabled={disableButton}
        >
          Confirm
        </Button>
        <Button
          className="dialog-button"
          testId="Dialog-close-button"
          buttonType="muted"
          onClick={() => {
            sdk.close()
          }}
        >
          Close
        </Button>
      </div>
    </div>
  )
}

Dialog.propTypes = {
  sdk: PropTypes.object.isRequired,
}

export default Dialog
