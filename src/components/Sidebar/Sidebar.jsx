import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

const Sidebar = ({ sdk }) => {
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  const onButtonClick = async () => {
    await sdk.dialogs.openExtension({
      fullWidth: true,
      title: `Select entries to change for '${sdk.contentType.name}'`,
      allowHeightOverflow: true,
      parameters: {
        ids: sdk.ids,
        contentType: sdk.contentType,
      },
    })
  }

  return (
    <Button
      buttonType="positive"
      isFullWidth={true}
      testId="open-dialog"
      onClick={onButtonClick}
    >
      {`Clone ${sdk.contentType.name}`}
    </Button>
  )
}

Sidebar.propTypes = {
  sdk: PropTypes.object.isRequired,
}

export default Sidebar
