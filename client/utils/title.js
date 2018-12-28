import React from 'react'
import {Helmet} from 'react-helmet'

export default ({children}) => (
	<Helmet defaultTitle='Almanac' titleTemplate='%s ✢ Almanac'>
		{children && <title>{children}</title>}
	</Helmet>
)
