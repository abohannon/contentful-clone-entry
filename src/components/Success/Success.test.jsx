import React from 'react'
import { render, wait } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Success from './Success'
import contentful from '../../util/contentfulUtil'

jest.mock('../../util/contentfulUtil')

describe('Success component', () => {
  beforeEach(() => {
    contentful.getClonedEntries.mockReturnValue(
      [
        {
          id: 'test1',
          name: 'testEntry1',
          data: {},
        },
        {
          id: 'test2',
          name: 'testEntry2',
          data: {},
        },
      ].reverse(),
    )
  })

  it('should render a message', () => {
    const { getByText } = render(<Success message="test" onDelete={() => {}} />)
    expect(getByText('test')).toBeInTheDocument()
  })

  it('should render cloned entries', async () => {
    const { getByText } = render(<Success message="test" onDelete={() => {}} />)
    expect(getByText('testEntry1')).toBeInTheDocument()
    expect(getByText('testEntry2')).toBeInTheDocument()
  })
})
