import React from 'react'
import PropTypes from 'prop-types'
import { List } from '@contentful/forma-36-react-components'
import EntryListItem from '../EntryListItem'
import './EntryListStyle.scss'

const EntryList = ({ entries, onChange, values }) => {
  return (
    <List id="parent-list" data-test-id="List-root" className="entry-list-root">
      {entries.map(entry => (
        <EntryListItem
          item={entry}
          key={entry.id}
          onChange={onChange}
          values={values}
        />
      ))}
    </List>
  )
}

List.propTypes = {
  entry: PropTypes.object,
  onChange: PropTypes.func,
  values: PropTypes.object,
}

export default EntryList
