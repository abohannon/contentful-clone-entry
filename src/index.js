import React from 'react'
import ReactDOM from 'react-dom'
import { init, locations } from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import Sidebar from './components/Sidebar'
import Dialog from './components/Dialog'
import './index.css'

export const initialize = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<Dialog sdk={sdk} />, document.getElementById('root'))
  } else {
    ReactDOM.render(<Sidebar sdk={sdk} />, document.getElementById('root'))
  }
}

init(initialize)

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
