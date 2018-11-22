import React from 'react'
import {go} from '../utils/router'
import preventingDefault from '../utils/preventing-default'

export default ({href, ...props}) => (
	<a href={href} onClick={preventingDefault(() => go(href))} {...props} />
)
