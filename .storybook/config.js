import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import GlobalStyles from '../imports/ui/visual/global'

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module)

addDecorator(storyFn => (
	<>
		<GlobalStyles />
		{storyFn()}
	</>
))
