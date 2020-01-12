import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EntryList from './EntryList'
import { treeData } from '../../util/tests/testData'

describe('EntryList component', () => {
  const defaultProps = {
    entries: treeData,
    onChange: () => {},
    values: {},
  }

  const renderComponent = (props = {}) => {
    const setupProps = { ...defaultProps, ...props }
    return render(<EntryList {...setupProps} />)
  }

  it('should render a list of checkboxes', () => {
    const { getByLabelText, debug } = renderComponent()

    expect(getByLabelText('Parent A')).toBeInTheDocument()
    expect(getByLabelText('Parent A').type).toBe('checkbox')

    expect(getByLabelText('Child A1')).toBeInTheDocument()
    expect(getByLabelText('Child A1').type).toBe('checkbox')

    expect(getByLabelText('Child A2')).toBeInTheDocument()
    expect(getByLabelText('Child A2').type).toBe('checkbox')

    expect(getByLabelText('Child A3')).toBeInTheDocument()
    expect(getByLabelText('Child A3').type).toBe('checkbox')

    expect(getByLabelText('Child A4')).toBeInTheDocument()
    expect(getByLabelText('Child A4').type).toBe('checkbox')

    expect(getByLabelText('Child A5, Parent B')).toBeInTheDocument()
    expect(getByLabelText('Child A5, Parent B').type).toBe('checkbox')

    expect(getByLabelText('Child B1')).toBeInTheDocument()
    expect(getByLabelText('Child B1').type).toBe('checkbox')
  })
})
