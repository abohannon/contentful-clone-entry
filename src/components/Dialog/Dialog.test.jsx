import React from 'react'
import {
  render,
  configure,
  fireEvent,
  wait,
  cleanup,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Dialog from './Dialog'
import { sdk } from '../../util/testUtils'
import contentful from '../../util/contentfulUtil'
import { treeData, data } from '../../util/tests/testData'

jest.mock('../../util/contentfulUtil')

configure({ testIdAttribute: 'data-test-id' })

describe('Dialog component', () => {
  const defaultProps = {
    sdk,
  }

  beforeEach(() => {
    jest.setTimeout(30000)
    contentful.buildEntryTree.mockReturnValue(treeData)
    contentful.getClonedEntries.mockReturnValue([
      {
        id: data['59MGATlEsP7tYFWokybSMY'].sys.id,
        name: data['59MGATlEsP7tYFWokybSMY'].sys.contentType.name,
        data: data['59MGATlEsP7tYFWokybSMY'],
      },
      {
        id: data['5uW2L7MAIpudEi89kZkqk7'].sys.id,
        name: data['5uW2L7MAIpudEi89kZkqk7'].sys.contentType.name,
        data: data['5uW2L7MAIpudEi89kZkqk7'],
      },
    ])
  })

  afterEach(() => cleanup())

  const renderComponent = (props = {}) => {
    const setupProps = { ...defaultProps, ...props }
    return render(<Dialog {...setupProps} />)
  }

  it('should render a list', async () => {
    const { getAllByTestId, getByTestId } = renderComponent()

    await wait(() => {
      expect(getAllByTestId('cf-ui-list').length).toBe(3)
      expect(
        getByTestId('ListItem-li-59MGATlEsP7tYFWokybSMY'),
      ).toBeInTheDocument()
    })
  })

  it('should check parent when child is selected', async () => {
    const { getByLabelText } = renderComponent()

    await wait(() => {
      const topLevelParent = getByLabelText('Parent A')
      const child = getByLabelText('Child A2')
      expect(topLevelParent.checked).toBe(false)

      fireEvent.click(child)

      expect(topLevelParent.checked).toBe(true)
    })
  })

  it('should check all parents when nested child is selected', async () => {
    const { getByLabelText } = renderComponent()

    await wait(() => {
      const topLevelParent = getByLabelText('Parent A')
      const secondLevelParent = getByLabelText('Child A5, Parent B')
      const child = getByLabelText('Child B1')
      expect(topLevelParent.checked).toBe(false)
      expect(secondLevelParent.checked).toBe(false)

      fireEvent.click(child)

      expect(topLevelParent.checked).toBe(true)
      expect(secondLevelParent.checked).toBe(true)
    })
  })

  it('should uncheck all children when top-level parent is unchecked', async () => {
    const { getByLabelText } = renderComponent()

    await wait(() => {
      const ParentA = getByLabelText('Parent A')
      const ChildA1 = getByLabelText('Child A1')
      const ChildA2 = getByLabelText('Child A2')
      const ChildA5_ParentB = getByLabelText('Child A5, Parent B')
      const ChildB1 = getByLabelText('Child B1')

      // Check that inputs are unchecked by default
      expect(ParentA.checked).toBe(false)
      expect(ChildA1.checked).toBe(false)
      expect(ChildA2.checked).toBe(false)
      expect(ChildA5_ParentB.checked).toBe(false)
      expect(ChildB1.checked).toBe(false)

      // Click child inputs.
      userEvent.click(ChildA1)
      userEvent.click(ChildA2)
      userEvent.click(ChildB1)

      // Check that child inputs and parents are checked.
      expect(ParentA.checked).toBe(true)
      expect(ChildA1.checked).toBe(true)
      expect(ChildA2.checked).toBe(true)
      expect(ChildA5_ParentB.checked).toBe(true)
      expect(ChildB1.checked).toBe(true)

      // Click top-level parent.
      userEvent.click(ParentA)

      expect(ParentA.checked).toBe(false)
      expect(ChildA1.checked).toBe(false)
      expect(ChildA2.checked).toBe(false)
      expect(ChildA5_ParentB.checked).toBe(false)
      expect(ChildB1.checked).toBe(false)
    })
  })

  it('should show a disabled "Confirm" button when no entries are selected', async () => {
    const { getByTestId } = renderComponent()
    const button = await getByTestId('Dialog-confirm-button')
    expect(button.disabled).toBe(true)
  })

  it('should show an enabled "Confirm" button when at least one entry is selected', async () => {
    const { getByLabelText, getByTestId } = renderComponent()

    await wait(() => {
      userEvent.click(getByLabelText('Child A1'))
      expect(getByTestId('Dialog-confirm-button').disable).toBe(undefined)
    })
  })

  it('should correctly display the success UI after cloning is successful', async () => {
    contentful.cloneEntry.mockReturnValue({
      sys: {
        id: 'test id',
        contentType: {
          sys: {
            id: 'test content type id',
          },
        },
      },
    })

    const { getByLabelText, getByTestId, getByText } = renderComponent()

    await wait(async () => {
      const ParentA = getByLabelText('Parent A')
      const ConfirmButton = getByTestId('Dialog-confirm-button')

      userEvent.click(ParentA)
      userEvent.click(ConfirmButton)

      await wait(() => {
        expect(contentful.getClonedEntries).toHaveBeenCalled()
        expect(getByText('Entries cloned successfully!')).toBeInTheDocument()
        expect(
          getByTestId('SuccessEntry-undo-59MGATlEsP7tYFWokybSMY'),
        ).toBeInTheDocument()
        expect(
          getByTestId('SuccessEntry-undo-5uW2L7MAIpudEi89kZkqk7'),
        ).toBeInTheDocument()
      })
    })
  })

  it('should call contentful.cloneEntry when confirm button is clicked and display error message when a result is not returned', async () => {
    contentful.cloneEntry.mockReturnValue(null)

    const { getByLabelText, getByTestId, unmount } = renderComponent()

    await wait(async () => {
      const ParentA = getByLabelText('Parent A')
      const ConfirmButton = getByTestId('Dialog-confirm-button')

      userEvent.click(ParentA)
      userEvent.click(ConfirmButton)

      await wait(() => {
        expect(getByTestId('ErrorMessage-root')).toBeInTheDocument()
      })
      unmount()
    })
  })

  it('should select all entries when the "Select all" checkbox is clicked', async () => {
    const { getByLabelText } = renderComponent()

    let toggle

    await wait(() => {
      toggle = getByLabelText('Select all')
    })

    expect(toggle).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(toggle.checked).toBe(true)

    await wait(() => {
      expect(getByLabelText('Parent A').checked).toBe(true)
      expect(getByLabelText('Child A1').checked).toBe(true)
      expect(getByLabelText('Child A2').checked).toBe(true)
      expect(getByLabelText('Child A3').checked).toBe(true)
      expect(getByLabelText('Child A4').checked).toBe(true)
      expect(getByLabelText('Child A5, Parent B').checked).toBe(true)
      expect(getByLabelText('Child B1').checked).toBe(true)
    })
  })
})
