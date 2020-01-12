import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EntryListItem from './EntryListItem'
import { sdk } from '../../util/testUtils'
import contentful from '../../util/contentfulUtil'

describe('EntryListItem component', () => {
  const defaultProps = {
    values: {},
    onChange: jest.fn(),
  }

  const renderComponent = (props = {}) => {
    const setupProps = { ...defaultProps, ...props }
    return render(<EntryListItem {...setupProps} />)
  }

  it('should render a list when entry data is passed', async () => {
    const entries = await contentful.buildEntryTree(
      '59MGATlEsP7tYFWokybSMY',
      sdk.space,
    )

    const { getByLabelText } = renderComponent({
      item: entries[0],
    })

    expect(getByLabelText('Parent A')).toBeInTheDocument()
    expect(getByLabelText('Child A1')).toBeInTheDocument()
    expect(getByLabelText('Child A2')).toBeInTheDocument()
    expect(getByLabelText('Child A3')).toBeInTheDocument()
    expect(getByLabelText('Child A4')).toBeInTheDocument()
    expect(getByLabelText('Child A5, Parent B')).toBeInTheDocument()
    expect(getByLabelText('Child B1')).toBeInTheDocument()
  })
})
