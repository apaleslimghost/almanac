import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'
import 'formdata-polyfill'

import App from '../imports/ui/app'

const root = document.createElement('div')
root.id = 'react-root'
document.body.appendChild(root)

Modal.setAppElement('#' + root.id)

render(<App />, root)
