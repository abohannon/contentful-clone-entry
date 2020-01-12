import React from 'react'
import PropTypes from 'prop-types'
import {
  List,
  ListItem,
  CheckboxField,
} from '@contentful/forma-36-react-components'
import './EntryListItemStyle.scss'

const EntryListItem = ({ item, onChange, values }) => {
  if (!item) return null
  let children = null

  if (item.children && item.children.length) {
    children = (
      <List
        data-test-id={`ListItem-ul-${item.id}`}
        className="entry-list-item-nested-list"
      >
        {item.children.map(child => (
          <EntryListItem
            item={child}
            key={child.id}
            onChange={onChange}
            values={values}
          />
        ))}
      </List>
    )
  }

  return (
    <ListItem
      className="entry-list-item-root"
      data-test-id={`ListItem-li-${item.id}`}
    >
      <CheckboxField
        data-test-id={`ListItem-checkbox-${item.id}`}
        key={item.id}
        id={`ListItem-checkbox-${item.id}`}
        labelText={item.name}
        helpText={item.type}
        name={item.id}
        value="yes"
        onChange={onChange(item)}
        checked={values[item.id] || false}
        className="entry-list-item-checkbox-root"
        inputProps={{
          className: 'entry-list-item-checkbox-input',
        }}
      />
      {children}
    </ListItem>
  )
}

EntryListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object),
  }),
}

export default EntryListItem
